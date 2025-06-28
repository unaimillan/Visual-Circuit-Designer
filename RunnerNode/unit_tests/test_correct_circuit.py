import asyncio
import pytest


@pytest.mark.asyncio
async def test_run_simulation_emits_no_error(socketio_client):
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

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

    assert not received_errors, f"Received errors: {received_errors}"
