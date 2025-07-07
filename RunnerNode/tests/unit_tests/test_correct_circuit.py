import asyncio
import pytest


@pytest.mark.asyncio
async def test_simulations_correctness1(socketio_client):
    result = {}
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    @socketio_client.on("simulation_outputs")
    def on_outputs(data):
        nonlocal result, done
        result = data
        if not done.is_set():
            done.set()

    mock_circuit = {
        "test_mode": True,
        "nodes": [
            {"id": "inputNodeSwitch1", "type": "inputNodeSwitch"},
            {"id": "inputNodeSwitch2", "type": "inputNodeSwitch"},
            {"id": "outputNodeLed", "type": "outputNodeLed"},
            {"id": "xorNode", "type": "xorNode"},
            {"id": "orNode", "type": "orNode"},
        ],
        "edges": [
            {"id": "inputNodeSwitch2-xorNode", "source": "inputNodeSwitch2", "target": "xorNode", "sourceHandle": "output-1", "targetHandle": "input-2"},
            {"id": "inputNodeSwitch1-orNode", "source": "inputNodeSwitch1", "target": "orNode", "sourceHandle": "output-1", "targetHandle": "input-1"},
            {"id": "inputNodeSwitch2-orNode", "source": "inputNodeSwitch2", "target": "orNode", "sourceHandle": "output-1", "targetHandle": "input-2"},
            {"id": "orNode-xorNode", "source": "orNode", "target": "xorNode", "sourceHandle": "output-1", "targetHandle": "input-1"},
            {"id": "xorNode-outputNodeLed", "source": "xorNode", "target": "outputNodeLed", "sourceHandle": "output-1", "targetHandle": "input-1"},
        ]
    }

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    for inputs, expected in [
        ({"in_inputNodeSwitch1": 1, "in_inputNodeSwitch2": 1}, 0),
        ({"in_inputNodeSwitch1": 1, "in_inputNodeSwitch2": 0}, 1),
        ({"in_inputNodeSwitch1": 0, "in_inputNodeSwitch2": 1}, 0),
        ({"in_inputNodeSwitch1": 0, "in_inputNodeSwitch2": 0}, 0),
    ]:
        done = asyncio.Event()
        await socketio_client.emit("set_inputs", {"inputs": inputs})
        try:
            await asyncio.wait_for(done.wait(), timeout=3)
        except asyncio.TimeoutError:
            assert False, "Timed out waiting for simulation_outputs"
        assert result.get("out_outputNodeLed") == expected

    await socketio_client.emit("stop_simulation")
    assert not received_errors, f"Received errors: {received_errors}"


@pytest.mark.asyncio
async def test_simulations_correctness2(socketio_client):
    result = {}
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    @socketio_client.on("simulation_outputs")
    def on_outputs(data):
        nonlocal result, done
        result = data
        if not done.is_set():
            done.set()

    mock_circuit = {
        "test_mode": True,
        "nodes": [
            {"id": "inputNodeSwitch1", "type": "inputNodeSwitch"},
            {"id": "inputNodeSwitch2", "type": "inputNodeSwitch"},
            {"id": "outputNodeLed", "type": "outputNodeLed"},
            {"id": "andNode", "type": "andNode"},
        ],
        "edges": [
            {"id": "inputNodeSwitch2-andNode", "source": "inputNodeSwitch2", "target": "andNode", "sourceHandle": "output-1", "targetHandle": "input-2"},
            {"id": "inputNodeSwitch1-andNode", "source": "inputNodeSwitch1", "target": "andNode", "sourceHandle": "output-1", "targetHandle": "input-1"},
            {"id": "andNode-outputNodeLed", "source": "andNode", "target": "outputNodeLed", "sourceHandle": "output-1", "targetHandle": "input-1"},
        ]
    }

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    for inputs, expected in [
        ({"in_inputNodeSwitch1": 1, "in_inputNodeSwitch2": 1}, 1),
        ({"in_inputNodeSwitch1": 1, "in_inputNodeSwitch2": 0}, 0),
        ({"in_inputNodeSwitch1": 0, "in_inputNodeSwitch2": 1}, 0),
        ({"in_inputNodeSwitch1": 0, "in_inputNodeSwitch2": 0}, 0),
    ]:
        done = asyncio.Event()
        await socketio_client.emit("set_inputs", {"inputs": inputs})
        try:
            await asyncio.wait_for(done.wait(), timeout=3)
        except asyncio.TimeoutError:
            assert False, "Timed out waiting for simulation_outputs"
        assert result.get("out_outputNodeLed") == expected

    await socketio_client.emit("stop_simulation")
    assert not received_errors, f"Received errors: {received_errors}"