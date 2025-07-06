import asyncio
import pytest
from cocotb.runner import get_runner


@pytest.mark.asyncio
async def test_generator_absence_data():
    runner = get_runner("icarus")

    runner.build(
        verilog_sources=["dut.v"],
        hdl_toplevel="GeneratedCircuit",
        build_dir="build"
    )

    runner.test(
        hdl_toplevel="GeneratedCircuit",
        test_module="cocotbTest",
    )

    await asyncio.sleep(1)


