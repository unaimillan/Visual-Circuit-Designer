const { getSelectedElements } = require("../flowHelpers");

describe("getSelectedElements", () => {
  it("returns only selected nodes and edges between them", () => {
    const nodes = [
      { id: "1", selected: true },
      { id: "2", selected: true },
      { id: "3", selected: false },
    ];
    const edges = [
      { id: "e1", source: "1", target: "2", selected: true },
      { id: "e2", source: "1", target: "3", selected: true },
      { id: "e3", source: "2", target: "3", selected: false },
    ];

    const result = getSelectedElements(nodes, edges);

    expect(result.nodes.map((n) => n.id)).toEqual(["1", "2"]);
    expect(result.edges.map((e) => e.id)).toEqual(["e1"]);
  });
});
