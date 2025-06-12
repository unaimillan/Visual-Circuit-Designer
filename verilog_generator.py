def generate_verilog(nodes, edges):
    verilog = "module top(input wire in1, in2, output wire out);\n"
    wire_count = 0
    wires = []

    for edge in edges:
        wires.append(f"wire w{wire_count};")
        edge["wire"] = f"w{wire_count}"
        wire_count += 1

    verilog += "\n".join(wires) + "\n\n"

    for node_id, node in nodes.items():
        node_type = node["type"]
        if node_type == "andNode":
            verilog += f"  and U{node_id}("
        elif node_type == "orNode":
            verilog += f"  or  U{node_id}("
        elif node_type == "notNode":
            verilog += f"  not U{node_id}("
        else:
            continue  # unknown node

        inputs = []
        outputs = []

        for edge in edges:
            if edge["target"] == node_id:
                inputs.append(edge["wire"])
            elif edge["source"] == node_id:
                outputs.append(edge["wire"])

        # Если узел не имеет явных входов (например, начальный)
        while len(inputs) < 2 and node_type != "notNode":
            inputs.append("in1")
        if node_type == "notNode" and len(inputs) < 1:
            inputs.append("in1")

        if len(outputs) == 0:
            outputs.append("out")

        ports = ", ".join(outputs + inputs)
        verilog += ports + ");\n"

    verilog += "endmodule\n"
    return verilog

if __name__ == "__main__":
    import json

    with open("circuit.json") as f:
        data = json.load(f)

    nodes = {node["id"]: node for node in data["nodes"]}
    edges = data["edges"]

    verilog_code = generate_verilog(nodes, edges)

    with open("top.v", "w") as f:
        f.write(verilog_code)

