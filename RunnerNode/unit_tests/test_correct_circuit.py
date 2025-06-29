import asyncio
import pytest


@pytest.mark.asyncio
async def test_run_simulation_emits_no_error(socketio_client):
    result = {}
    done = asyncio.Event()
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    @socketio_client.on("simulation_outputs")
    def on_outputs(data):
        nonlocal result
        print("Received outputs:", data)
        result = data
        done.set()

    mock_circuit = {
        "nodes": [
            {
              "id": "inputNodeSwitch1",
              "type": "inputNodeSwitch"
            },
            {
              "id": "inputNodeSwitch2",
              "type": "inputNodeSwitch"
            },
            {
              "id": "outputNodeLed",
              "type": "outputNodeLed"
            },
            {
              "id": "xorNode",
              "type": "xorNode"
            },
            {
              "id": "orNode",
              "type": "orNode"
            }
          ],

        "edges": [
            {
              "id": "inputNodeSwitch2-xorNode",
              "source": "inputNodeSwitch2",
              "target": "xorNode",
              "sourceHandle": "output-1",
              "targetHandle": "input-2"
            },
            {
              "id": "inputNodeSwitch1-orNode",
              "source": "inputNodeSwitch1",
              "target": "orNode",
              "sourceHandle": "output-1",
              "targetHandle": "input-1"
            },
            {
              "id": "inputNodeSwitch2-orNode",
              "source": "inputNodeSwitch2",
              "target": "orNode",
              "sourceHandle": "output-1",
              "targetHandle": "input-2"
            },
            {
              "id": "orNode-xorNode",
              "source": "orNode",
              "target": "xorNode",
              "sourceHandle": "output-1",
              "targetHandle": "input-1"
            },
            {
              "id": "xorNode-outputNodeLed",
              "source": "xorNode",
              "target": "outputNodeLed",
              "sourceHandle": "output-1",
              "targetHandle": "input-1"
            }
          ]
    }

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    await socketio_client.emit("set_inputs", { "inputs": {"in_inputNodeSwitch1": 1, "in_inputNodeSwitch2": 1}})
    await asyncio.sleep(1)

    await asyncio.wait_for(done.wait(), timeout=2)
    await socketio_client.emit("stop_simulation")

    assert result.get("out_outputNodeLed") == 0

    assert not received_errors, f"Received errors: {received_errors}"


