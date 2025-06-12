import cocotb
from cocotb.triggers import Timer
import socketio

sio = socketio.AsyncClient()

@cocotb.coroutine
async def connect_socket():
    await sio.connect('http://localhost:5252')
    print("Connected to SocketIO server")

input_values = {"in1": 0, "in2": 0}

@sio.on('input_change')
def on_input_change(data):
    global input_values
    input_values.update(data)
    print("New input received:", input_values)

@cocotb.test()
async def interactive_test(dut):
    await connect_socket()

    for _ in range(1000):
        dut.in1 <= input_values["in1"]
        dut.in2 <= input_values["in2"]

        await sio.sleep(0)  # Allow socket IO to run
        await Timer(10, units='ns')

    await sio.disconnect()