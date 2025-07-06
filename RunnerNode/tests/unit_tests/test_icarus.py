import pytest
import warnings
with warnings.catch_warnings():
    warnings.simplefilter("ignore", category=UserWarning)
    from cocotb.runner import get_runner


@pytest.mark.asyncio
async def test_icarus_build():
    runner = get_runner("icarus")

    runner.build(
        verilog_sources=["RunnerNode/tests/unit_tests/dut.v"],
        hdl_toplevel="GeneratedCircuit",
        build_dir="build"
    )
