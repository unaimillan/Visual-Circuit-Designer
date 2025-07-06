import json
import cocotb
from cocotb.triggers import Timer
from cocotb.runner import get_runner


def collect_all_signals(dut, prefix=""):
    signals = {}

    for name in dir(dut):
        if name.startswith("_") or callable(getattr(dut, name)):
            continue

        obj = getattr(dut, name)

        if hasattr(obj, 'value'):
            try:
                signals[prefix + name] = int(obj.value)
            except ValueError:
                signals[prefix + name] = str(obj.value)

        elif hasattr(obj, '_sub_handles'):
            sub_signals = collect_all_signals(obj, prefix + name + ".")
            signals.update(sub_signals)

    return signals


def get_logic_gate_steps(dut):
    return [
        ("and_gate_andNode", "and_gate"),
        ("or_gate_orNode", "or_gate"),
        ("outputNodeLed", "output")
    ]


@cocotb.test()
async def step_by_step_simulation(dut):
    execution_steps = get_logic_gate_steps(dut)

    test_inputs = [
        {"in_inputNodeSwitch1": 1, "in_inputNodeSwitch2": 0},
        {"in_inputNodeSwitch1": 0, "in_inputNodeSwitch2": 0},
        {"in_inputNodeSwitch1": 0, "in_inputNodeSwitch2": 1},
        {"in_inputNodeSwitch1": 1, "in_inputNodeSwitch2": 1},
    ]

    results = []

    for input_idx, input_vals in enumerate(test_inputs):
        for name, value in input_vals.items():
            if hasattr(dut, name):
                getattr(dut, name).value = value

        await Timer(1, units="ns")
        step_results = [{
            "step": "Input",
            "values": collect_all_signals(dut)
        }]

        for step_idx, (element, gate_type) in enumerate(execution_steps):
            await Timer(1, units="step")

            step_results.append({
                "step": f"Step {step_idx + 1} ({element})",
                "gate": gate_type,
                "values": collect_all_signals(dut)
            })

        results.append({
            "input_set": input_idx,
            "inputs": input_vals,
            "steps": step_results
        })

    with open("step_by_step_results.json", "w") as f:
        json.dump(results, f, indent=2)

    dut._log.info("Step-by-step simulation completed")


def run_cocotb_test():
    runner = get_runner("icarus")

    runner.build(
        verilog_sources=["dut.v", "and_gate.v", "or_gate.v"],
        hdl_toplevel="GeneratedCircuit",
        build_dir="build",
        always=True,
    )

    runner.test(
        hdl_toplevel="GeneratedCircuit",
        test_module="trace",
    )


if __name__ == "__main__":
    run_cocotb_test()