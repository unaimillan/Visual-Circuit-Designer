import { getClosestEdge } from "../../getClosestEdge";

const createHandle = (x, y, id = "a", width = 10, height = 10) => ({
  id,
  x,
  y,
  width,
  height,
});

const createNode = (id, x, y, handles = {}) => ({
  id,
  internals: {
    handleBounds: handles,
    positionAbsolute: { x, y },
  },
});

describe("getClosestEdge", () => {
  const draggedNode = { id: "n1" };
  const getInternalNode = (id) =>
    id === "n1"
      ? createNode("n1", 0, 0, { source: [createHandle(0, 0, "s1")] })
      : null;

  const nodeLookup = new Map([
    [
      "n2",
      createNode("n2", 0.5, 0, { target: [createHandle(0, 0, "t1")] }),
    ],
  ]);

  it("should return a temp edge when handle distance is below threshold", () => {
    const edges = [];
    const edge = getClosestEdge({
      draggedNode,
      nodeLookup,
      getInternalNode,
      edges,
    });

    expect(edge).not.toBeNull();
    expect(edge.source).toBe("n1");
    expect(edge.target).toBe("n2");
  });

  it("should return null if no internal node found", () => {
    const getBad = () => null;
    const edge = getClosestEdge({
      draggedNode,
      nodeLookup,
      getInternalNode: getBad,
      edges: [],
    });
    expect(edge).toBeNull();
  });

  it("should return null if no handle bounds", () => {
    const getBad = () =>
      createNode("n1", 0, 0, null);
    const edge = getClosestEdge({
      draggedNode,
      nodeLookup,
      getInternalNode: getBad,
      edges: [],
    });
    expect(edge).toBeNull();
  });

  it("should not connect to already used target handles", () => {
    const edges = [
      { target: "n2", targetHandle: "t1" },
    ];
    const edge = getClosestEdge({
      draggedNode,
      nodeLookup,
      getInternalNode,
      edges,
    });
    expect(edge).toBeNull();
  });
});
