import { pasteElements } from "../../pasteElements";
import { calculatePosition } from "../../calculatePosition.js";
import { generateId } from "../../generateId.js";

jest.mock("../../calculatePosition.js");
jest.mock("../../generateId.js");

describe("pasteElements", () => {
  const mockSetNodes = jest.fn((fn) => fn([]));
  const mockSetEdges = jest.fn((fn) => fn([]));
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
    calculatePosition.mockReturnValue({ x: 100, y: 100 });

    generateId
      .mockReturnValueOnce("node-1")
      .mockReturnValueOnce("custom-1")
      .mockReturnValueOnce("edge-1");
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
    });

    expect(mockSetNodes).toHaveBeenCalledTimes(1);
    expect(mockSetEdges).toHaveBeenCalledTimes(1);
  });

  it("pastes gates and wires with offset", () => {
    pasteElements({
      clipboard,
      mousePosition: { x: 50, y: 50 },
      reactFlowInstance: mockReactFlowInstance,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
    });

    expect(mockSetNodes).toHaveBeenCalledTimes(2);
    expect(mockSetEdges).toHaveBeenCalledTimes(2);

    expect(generateId).toHaveBeenCalledTimes(3);
    expect(calculatePosition).toHaveBeenCalledWith({ x: 50, y: 50 }, "foo");

    const addNodesFn = mockSetNodes.mock.calls[1][0];
    const resultNodes = addNodesFn([]);
    expect(resultNodes).toEqual([
      {
        id: "node-1",
        type: "foo",
        position: { x: 100, y: 100 },
        selected: true,
        data: { customId: "custom-1" },
      },
    ]);

    const addEdgesFn = mockSetEdges.mock.calls[1][0];
    const resultEdges = addEdgesFn([]);
    expect(resultEdges).toEqual([
      {
        id: "edge-1",
        source: "node-1",
        target: "node-1",
      },
    ]);
  });
});
