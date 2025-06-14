import asyncio
import sys
import os
from pathlib import Path
from cocotb.runner import get_runner


def run_cocotb_test(sim_path, input_queue, output_queue, sid):
    from cocotb.runner import get_runner

    runner = get_runner("icarus")
    runner.build(
        verilog_sources=[os.path.join(sim_path, "dut.v")],
        hdl_toplevel="GeneratedCircuit",
        build_dir=os.path.join(sim_path, "build")
    )

    runner.test(
        hdl_toplevel="GeneratedCircuit",
        test_module="cocotbTest",
        plusargs=[f"SIM_PATH={sim_path}"],
        extra_env={
            "INPUT_QUEUE": str(id(input_queue)),
            "OUTPUT_QUEUE": str(id(output_queue)),
            "SOCKETIO_SID": sid
        }
    )

if __name__ == "__main__":
    sim_path = os.path.abspath(sys.argv[1])
    asyncio.run(run_cocotb_test(sim_path))