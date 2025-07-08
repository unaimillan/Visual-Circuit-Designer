import { deselectAll } from "../deselectAll";

describe("deselectAll", () => {
  it("removes the selection of nodes and edges", () => {
    const nodes = [
      { id: "1", selected: true },
      { id: "2", selected: true },
    ];
    const edges = [
      { id: "e1", selected: true },
      { id: "e2", selected: true },
    ];

    const { nodes: newNodes, edges: newEdges } = deselectAll(nodes, edges);

    expect(newNodes.every((n) => !n.selected)).toBe(true);
    expect(newEdges.every((e) => !e.selected)).toBe(true);
  });
});
