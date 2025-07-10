import { onNodeDragStop } from "../../onNodeDragStop";
import { getClosestEdge } from "../../getClosestEdge";

jest.mock("../../getClosestEdge", () => ({
  getClosestEdge: jest.fn(),
}));

describe("onNodeDragStop util", () => {
  it("calls addEdge and setEdges when getClosestEdge returns an edge", () => {
    const mockEdge = {
      source: "1",
      sourceHandle: "s",
      target: "2",
      targetHandle: "t",
      className: "temp",
    };
    getClosestEdge.mockReturnValue(mockEdge);

    const nodes = [{ id: "1", selected: true }];
    const draggedNode = { id: "1" };
    const mockSetEdges = jest.fn((updater) => {
      return updater([]);
    });
    const mockAddEdge = jest.fn((edge, edges) => [...edges, edge]);
    const mockStore = { getState: () => ({ nodeLookup: new Map() }) };
    const mockGetInternalNode = jest.fn(); // not used by this test

    const handler = onNodeDragStop({
      nodes,
      setEdges: mockSetEdges,
      getInternalNode: mockGetInternalNode,
      store: mockStore,
      addEdge: mockAddEdge,
    });

    handler(null, draggedNode);

    expect(getClosestEdge).toHaveBeenCalled();
    expect(mockAddEdge).toHaveBeenCalled();
    expect(mockSetEdges).toHaveBeenCalled();
  });

  it("does nothing when getClosestEdge returns null", () => {
    getClosestEdge.mockReturnValue(null);

    const nodes = [{ id: "1", selected: true }];
    const handler = onNodeDragStop({
      nodes,
      setEdges: jest.fn(),
      getInternalNode: jest.fn(),
      store: { getState: () => ({ nodeLookup: new Map() }) },
      addEdge: jest.fn(),
    });

    handler(null, { id: "1" });

    expect(getClosestEdge).toHaveBeenCalled();
  });
});
