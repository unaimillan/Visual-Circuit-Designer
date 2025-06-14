import multiprocessing
import os
import json
import socket
import uuid
from fastapi import FastAPI
import socketio
from verilog_generator import generate_verilog_from_json
from cocotbTest import run_cocotb_test


sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = FastAPI()
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

HOST = '127.0.0.1'
PORT = 52525
user_sessions = {}

def extract_input_nodes(circuit_json):
    input_nodes = []
    for node in circuit_json["nodes"]:
        if node["type"] == "inputNode":
            input_nodes.append(f"in_{node['id'].replace('-', '_')}")
    return input_nodes


@sio.on("connect")
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit("status", {"msg": "Connected to server"}, to=sid)


@sio.on("disconnect")
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    await stop_simulation(sid)

def send_inputs_to_simulation(inputs):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        msg = json.dumps({"inputs": inputs}).encode()
        s.sendall(msg)

@sio.on("run_simulation")
async def run_simulation(sid, data):
    if sid in user_sessions:
        await sio.emit("error", {"msg": "Simulation already running"}, to=sid)
        return

    sim_id = str(uuid.uuid4())
    sim_path = os.path.join("simulations", sim_id)
    os.makedirs(sim_path, exist_ok=True)

    json_path = os.path.join(sim_path, "circuit.json")
    with open(json_path, "w") as f:
        json.dump(data, f)

    verilog_code = generate_verilog_from_json(json_path)
    verilog_path = os.path.join(sim_path, "dut.v")
    with open(verilog_path, "w") as f:
        f.write(verilog_code)

    input_nodes = extract_input_nodes(data)
    default_inputs = {node: 0 for node in input_nodes}

    p = multiprocessing.Process(
        target=run_cocotb_test,
        args=(sim_path, sid)
    )
    p.start()

    # Send initial status
    await sio.emit("status", {"msg": "Simulation started"}, to=sid)


@sio.on("set_inputs")
async def set_inputs(sid, data):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(json.dumps({"cmd": "TICK", "inputs": data['inputs']}).encode())
        response = s.recv(4096)
        print("Received:", json.loads(response.decode()))

@sio.on("stop_simulation")
async def stop_simulation(sid):
    sock = user_sessions.pop(sid, None)
    if sock:
        sock.sendall(json.dumps({"cmd": "STOP"}).encode())
        sock.close()
