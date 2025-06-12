import socketio

sio = socketio.AsyncServer(async_mode='asgi')
app = socketio.ASGIApp(sio)

input_values = {"in1": 0, "in2": 0}

@sio.event
async def connect(sid, environ):
    print("Client connected:", sid)

@sio.event
async def input_change(sid, data):
    global input_values
    input_values.update(data)
    print("Updated input:", input_values)

# для cocotb
async def get_input():
    return input_values

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=5000, reload=True)