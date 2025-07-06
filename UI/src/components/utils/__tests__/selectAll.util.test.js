import { selectAll } from "../flowHelpers";

describe("selectAll", () => {
  it("selects logic gates and wires", () => {
    const nodes = [
      { id: "1", selected: false },
      { id: "2", selected: false },
    ];
    const edges = [
      { id: "e1", selected: false },
      { id: "e2", selected: false },
    ];

    const { nodes: newNodes, edges: newEdges } = selectAll(nodes, edges);

    expect(newNodes.every((n) => n.selected)).toBe(true);
    expect(newEdges.every((e) => e.selected)).toBe(true);
  });
});
