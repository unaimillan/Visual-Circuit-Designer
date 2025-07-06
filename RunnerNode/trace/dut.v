`timescale 1ns/1ps

module GeneratedCircuit (
    input in_inputNodeSwitch1,
    input in_inputNodeSwitch2,
    output out_outputNodeLed
);
    // Wires declarations
    wire wire_andNode;
    wire wire_orNode;

    // Logic gates
    and_gate and_gate_andNode (wire_andNode, in_inputNodeSwitch1, in_inputNodeSwitch2);

    or_gate or_gate_orNode (wire_orNode, in_inputNodeSwitch1, wire_andNode);

    // Output connections
    assign out_outputNodeLed = wire_orNode;

endmodule
