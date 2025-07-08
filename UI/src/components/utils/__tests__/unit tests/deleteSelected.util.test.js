import { deleteSelected } from "../../deleteSelected.js";

describe("deleteSelected", () => {
  it("delete selected gates and wires", () => {
    const allNodes = [{ id: "1" }, { id: "2" }, { id: "3" }];

    const allEdges = [
      { id: "e1", source: "1", target: "2" },
      { id: "e2", source: "2", target: "3" },
    ];

    const clipboard = {
      nodes: [{ id: "1" }],
      edges: [{ id: "e1" }],
    };

    const { newNodes, newEdges } = deleteSelected(
      allNodes,
      allEdges,
      clipboard,
    );

    expect(newNodes).toEqual([{ id: "2" }, { id: "3" }]);

    expect(newEdges).toEqual([{ id: "e2", source: "2", target: "3" }]);
  });

  it("returns initial data if nothing was selected", () => {
    const allNodes = [{ id: "1" }];
    const allEdges = [{ id: "e1", source: "1", target: "1" }];

    const clipboard = { nodes: [], edges: [] };

    const { newNodes, newEdges } = deleteSelected(
      allNodes,
      allEdges,
      clipboard,
    );

    expect(newNodes).toEqual(allNodes);
    expect(newEdges).toEqual(allEdges);
  });
});
