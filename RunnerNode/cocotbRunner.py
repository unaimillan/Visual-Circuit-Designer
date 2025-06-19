import os
import sys
from pathlib import Path
from cocotb.runner import get_runner

def run_cocotb_test(sim_path):
    os.environ["SIM_PATH"] = sim_path
    sim = os.getenv("SIM", "icarus")
    hdl_toplevel_lang = os.getenv("HDL_TOPLEVEL_LANG", "verilog")

    proj_path = Path(__file__).resolve().parent
    src_path = proj_path / "src"
    cocotb_path = proj_path / "cocotb"

    verilog_sources = [
        # *src_path.rglob('*.svh'),
        # *src_path.rglob('*.sv'),
        *src_path.glob('*.v'),
        # *(proj_path / 'peripherals').glob('*.sv')
    ]

    print(proj_path)
    print(cocotb_path)

    vhdl_sources = []

    verilog_includes = []

    if hdl_toplevel_lang == "verilog":
        # verilog_sources.append(cocotb_path / "dut.v")
        verilog_sources.append("dut.v")
    else:
        vhdl_sources.append(proj_path / "top.vhdl")

    runner = get_runner(sim)
    runner.build(
        verilog_sources=verilog_sources,
        vhdl_sources=vhdl_sources,
        includes=verilog_includes,
        hdl_toplevel="GeneratedCircuit",
        always=True,
    )

    runner.test(
        hdl_toplevel="GeneratedCircuit",
        test_module="cocotbTest",
    )

if __name__ == "__main__":
    sim_path = sys.argv[1]
    run_cocotb_test(sim_path)