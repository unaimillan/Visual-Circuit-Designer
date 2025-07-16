import asyncio

import pytest


@pytest.mark.asyncio
async def test_generator_absence_data(socketio_client):
    received_errors = []

    @socketio_client.on("error")
    def on_error(data):
        received_errors.append(data)

    mock_circuit = {"test_mode": True, }

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

    mock_circuit = {"test_mode": True, "bruh": None}

    await socketio_client.emit("run_simulation", mock_circuit)
    await asyncio.sleep(1)

    assert received_errors
    assert "msg" in received_errors[0]