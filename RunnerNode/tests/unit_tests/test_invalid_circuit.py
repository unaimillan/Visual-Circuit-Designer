import asyncio
import pytest


@pytest.mark.asyncio
async def test_run_simulation_invalid_data1(socketio_client):
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    mock_circuit = {
        "test_mode": True,
        "nodes": [],
        "edges": []
    }

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    assert received_errors
    assert "msg" in received_errors[0]


@pytest.mark.asyncio
async def test_run_simulation_invalid_data2(socketio_client):
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    # Output absence
    mock_circuit = {
        "test_mode": True,
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
              "id": "andNode",
              "type": "andNode"
            }
          ],

        "edges": [
            {
              "id": "inputNodeSwitch2-andNode",
              "source": "inputNodeSwitch2",
              "target": "andNode",
              "sourceHandle": "output-1",
              "targetHandle": "input-2"
            },
            {
              "id": "inputNodeSwitch1-andNode",
              "source": "inputNodeSwitch1",
              "target": "andNode",
              "sourceHandle": "output-1",
              "targetHandle": "input-1"
            },
          ]
    }

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    assert received_errors
    assert "msg" in received_errors[0]
