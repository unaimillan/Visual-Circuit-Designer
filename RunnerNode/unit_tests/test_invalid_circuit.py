import asyncio
import pytest


@pytest.mark.asyncio
async def test_run_simulation_invalid_data1(socketio_client):
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    mock_circuit = {
        "nodes": [],
        "edges": []
    }

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    assert received_errors
    assert "msg" in received_errors[0]


@pytest.mark.asyncio
async def test_generator_invalid_data(socketio_client):
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    mock_circuit = "bruh"

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    assert received_errors
    assert "msg" in received_errors[0]


@pytest.mark.asyncio
async def test_absence_data_invalid_data(socketio_client):
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    mock_circuit = None

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    assert received_errors
    assert "msg" in received_errors[0]
