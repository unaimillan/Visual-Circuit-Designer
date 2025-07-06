import pytest
import cocotb
import warnings

from cocotb.triggers import Timer

with warnings.catch_warnings():
    warnings.simplefilter("ignore", category=UserWarning)
    from cocotb.runner import get_runner


@pytest.mark.asyncio
async def test_icarus_build():
    runner = get_runner("icarus")

    try:
        runner.build(
            verilog_sources=["RunnerNode/tests/unit_tests/dut.v"],
            hdl_toplevel="TestCircuit",
            build_dir="build"
        )

        runner.test(
            hdl_toplevel="TestCircuit",
            test_module="test_icarus",
        )
    except (Exception, SystemExit, BaseException) as e:
        raise AssertionError from e


@cocotb.test()
async def basic_and_test(dut):
    test_vectors = [
        (0, 0),
        (0, 1),
        (1, 0),
        (1, 1),
    ]

    for a_val, b_val in test_vectors:
        dut.in_inputNodeSwitch_1751828388369.value = a_val
        dut.in_inputNodeSwitch_1751828395135.value = b_val
        await Timer(1, units="ns")
