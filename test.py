import socketio
import json
import threading
import time


sio = socketio.Client()

sio.connect('http://127.0.0.1:8000')
print("Connected to server")

with open("circuit.json") as f:
    circuit_json = json.load(f)


def send_commands():
    while True:
        print("\nAvailable commands:")
        print("1. run_simulation")
        print("2. set_inputs")
        print("3. stop_simulation")
        print("4. exit")

        choice = input("Enter command number: ").strip()

        if choice == "1":
            sio.emit("run_simulation", circuit_json)
            print("Sent run_simulation command")

        elif choice == "2":
            inputs = {}
            print("Enter inputs in format: node_name value (e.g., in_inputNode_1 1)")
            print("Enter 'done' when finished")

            while True:
                inp = input("Input (or 'done'): ").strip()
                if inp.lower() == 'done':
                    break

                try:
                    node, value = inp.split()
                    inputs[node] = int(value)
                except:
                    print("Invalid input format. Try again.")
                    continue

            sio.emit("set_inputs", {"inputs": inputs})
            print(f"Sent set_inputs command with {inputs}")

        elif choice == "3":
            sio.emit("stop_simulation", {})
            print("Sent stop_simulation command")

        elif choice == "4":
            sio.emit("stop_simulation", {})
            sio.disconnect()
            print("Disconnected from server")
            break

        else:
            print("Invalid choice. Try again.")


command_thread = threading.Thread(target=send_commands)
command_thread.daemon = True
command_thread.start()


@sio.on('simulation_output')
def on_output(data):
    print(f"\nReceived simulation output: {data}")


@sio.on('simulation_stopped')
def on_stopped(data):
    print(f"\nSimulation stopped: {data}")


@sio.on('disconnect')
def on_disconnect():
    print("\nDisconnected from server")


try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    sio.emit("stop_simulation", {})
    sio.disconnect()
    print("\nDisconnected by user")