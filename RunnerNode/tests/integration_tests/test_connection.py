import asyncio
import pytest


@pytest.mark.asyncio
async def test_cocotb_runner_backend_connection(socketio_client):
    done = asyncio.Event()

    @socketio_client.on("simulation_ready")
    def on_connect():
        done.set()

    # Sample circuit
    mock_circuit = {
        "test_mode": True,
        "nodes": [
            {
              "id": "inputNodeSwitch",
              "type": "inputNodeSwitch"
            },
            {
                "id": "outputNodeSwitch",
                "type": "outputNodeSwitch"
            }
        ],
        "edges": [
            {
                "id": "inputNodeSwitch-outputNodeSwitch",
                "source": "inputNodeSwitch",
                "target": "outputNodeSwitch",
                "sourceHandle": "output-1",
                "targetHandle": "input-1"
            }
        ]
    }

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(0.5)

    await socketio_client.emit("stop_simulation")

    await socketio_client.disconnect()

    assert done
