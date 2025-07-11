import { pasteElements } from "../../pasteElements";
import { calculatePosition } from "../../calculatePosition.js";

jest.mock("../../calculatePosition.js", () => ({
  calculatePosition: jest.fn(() => ({ x: 100, y: 100 })),
}));

describe("pasteElements", () => {
  const mockSetNodes = jest.fn((fn) => fn([]));
  const mockSetEdges = jest.fn((fn) => fn([]));
  const mockNewId = jest
    .fn()
    .mockReturnValueOnce("node-1")   // first node id
    .mockReturnValueOnce("custom-1") // customId for node
    .mockReturnValueOnce("edge-1");  // edge id

  const mockReactFlowInstance = {
    screenToFlowPosition: jest.fn(() => ({ x: 50, y: 50 })),
  };

  const clipboard = {
    nodes: [
      {
        id: "1",
        type: "foo",
        position: { x: 10, y: 10 },
        data: { customId: "old" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "1",
        target: "1",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does nothing if reactFlowInstance is null", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    pasteElements({
      clipboard,
      mousePosition: { x: 0, y: 0 },
      reactFlowInstance: null,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      newId: mockNewId,
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "React Flow instance not available",
    );
  });

  it("does nothing if clipboard is empty", () => {
    pasteElements({
      clipboard: { nodes: [], edges: [] },
      mousePosition: { x: 0, y: 0 },
      reactFlowInstance: mockReactFlowInstance,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      newId: mockNewId,
    });

    expect(mockSetNodes).toHaveBeenCalledTimes(1); // deselect call
    expect(mockSetEdges).toHaveBeenCalledTimes(1); // deselect call
  });

  it("pastes gates and wires with offset", () => {
    pasteElements({
      clipboard,
      mousePosition: { x: 50, y: 50 },
      reactFlowInstance: mockReactFlowInstance,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      newId: mockNewId,
    });

    expect(mockSetNodes).toHaveBeenCalledTimes(2);
    expect(mockSetEdges).toHaveBeenCalledTimes(2);
    expect(mockNewId).toHaveBeenCalledTimes(3);
    expect(calculatePosition).toHaveBeenCalledWith(
      { x: 50, y: 50 },
      "foo"
    );
  });
});
