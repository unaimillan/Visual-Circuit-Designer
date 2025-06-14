import json
import os
import socket
import threading
import time

import cocotb
from cocotb.triggers import Timer


HOST = '127.0.0.1'
PORT = 52525

signal_values = {}
processed_outputs = {}
new_data_event = threading.Event()
stop_flag = False

def run_cocotb_test(sim_path, sid):
    from cocotb.runner import get_runner

    runner = get_runner("icarus")
    runner.build(
        verilog_sources=[os.path.join(sim_path, "dut.v")],
        hdl_toplevel="GeneratedCircuit",
        build_dir=os.path.join(sim_path, "build")
    )

    runner.test(
        hdl_toplevel="GeneratedCircuit",
        test_module="cocotbTest",
        plusargs=[f"SIM_PATH={sim_path}"],
    )

def socket_server(dut):
    global signal_values, new_data_event, stop_flag, SOCK

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        dut._log.info("Socket server listening for connections...")
        conn, addr = s.accept()
        with conn:
            dut._log.info(f"Connected by {addr}")
            while True:
                data = conn.recv(4096)
                if not data:
                    break
                msg = json.loads(data.decode())
                if msg.get("cmd") == "STOP":
                    stop_flag = True
                    new_data_event.set()
                    break
                elif msg.get("cmd") == "TICK":
                    inputs = msg.get("inputs", {})

                    signal_values = inputs
                    new_data_event.set()

                    while new_data_event.is_set():
                        time.sleep(0.001)

                    conn.sendall(json.dumps({"outputs": processed_outputs}).encode())


@cocotb.test()
async def interactive_test(dut):
    threading.Thread(target=socket_server, args=(dut,), daemon=True).start()
    dut._log.info("Socket server started in cocotb test")

    global signal_values, new_data_event, stop_flag, processed_outputs

    while not stop_flag:
        dut._log.info("Waiting for new input from socket...")
        while not new_data_event.is_set():
            await Timer(1, units='ns')

        if stop_flag:
            dut._log.info("Stop flag received, ending simulation...")
            break

        for name, value in signal_values.items():
            if hasattr(dut, name):
                setattr(dut, name, value)
            else:
                dut._log.warning(f"Signal {name} not found in DUT")

        await Timer(1, units='ns')

        processed_outputs = {
            name: int(getattr(dut, name).value)
            for name in dir(dut)
            if name.startswith("out_")
        }
        dut._log.info(f"Outputs: {processed_outputs}")

        new_data_event.clear()