import cocotb
from cocotb.triggers import Timer
from itertools import product

@cocotb.test()
async def interactive_test(dut):
    while True:
        val1 = int(input("Enter value for in_inputNode_1 (0/1, -1 quit): "))
        if val1 == -1:
            break
        val2 = int(input("Enter value for in_inputNode_2 (0/1): "))

        dut.in_inputNode_1749769125276.value = val1
        dut.in_inputNode_1749769128525.value = val2

        await Timer(1, units='ns')

        out1 = dut.out_outputNode_1749769172260.value
        out2 = dut.out_outputNode_1749769177326.value

        print(f"Output 1: {out1}")
        print(f"Output 2: {out2}")