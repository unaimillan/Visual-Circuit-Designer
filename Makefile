TOPLEVEL_LANG = verilog
VERILOG_SOURCES = \
    ./top.v

TOPLEVEL = GeneratedCircuit
MODULE = cocotbTest
SIM = icarus

include $(shell cocotb-config --makefiles)/Makefile.sim