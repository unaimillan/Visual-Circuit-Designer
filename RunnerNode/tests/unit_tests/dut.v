`timescale 1ns/1ps

module TestCircuit (
    input in_inputNodeSwitch_1751828388369,
    input in_inputNodeSwitch_1751828395135,
    output out_outputNodeLed_1751828428449,
    output out_outputNodeLed_1751828434821
);

    // Wires declarations
    wire wire_norNode_1751828382752;
    wire wire_norNode_1751828383065;

    // Logic gates
    nor nor_gate_norNode_1751828382752 (wire_norNode_1751828382752, wire_norNode_1751828383065, in_inputNodeSwitch_1751828395135);
    nor nor_gate_norNode_1751828383065 (wire_norNode_1751828383065, in_inputNodeSwitch_1751828388369, wire_norNode_1751828382752);

    // Output connections
    assign out_outputNodeLed_1751828428449 = wire_norNode_1751828383065;
    assign out_outputNodeLed_1751828434821 = wire_norNode_1751828382752;

endmodule
