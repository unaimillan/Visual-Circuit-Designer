import { spawnCircuit } from "../../spawnCircuit";

describe("spawnCircuit", () => {
  let mockInstance;
  let mockSetNodes;
  let mockNewId;

  beforeEach(() => {
    mockInstance = {
      screenToFlowPosition: jest.fn(() => ({ x: 100, y: 200 })),
    };
    mockSetNodes = jest.fn();
    mockNewId = jest
      .fn()
      .mockReturnValueOnce("node-123")
      .mockReturnValueOnce("node-456");
  });

  it("does nothing if reactFlowInstance is falsy", () => {
    spawnCircuit("AND", null, mockSetNodes, mockNewId);
    expect(mockSetNodes).not.toHaveBeenCalled();
    expect(mockNewId).not.toHaveBeenCalled();
  });

  it("calls screenToFlowPosition and setNodes with a selected node", () => {
    spawnCircuit("AND", mockInstance, mockSetNodes, mockNewId);

    expect(mockInstance.screenToFlowPosition).toHaveBeenCalledWith({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    expect(mockNewId).toHaveBeenCalledTimes(2);

    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Function));

    const updater = mockSetNodes.mock.calls[0][0];
    const before = [{ id: "existing-node" }];
    const result = updater(before);

    expect(result).toEqual([
      { id: "existing-node" },
      {
        id: "node-123",
        type: "AND",
        position: { x: 100, y: 200 },
        selected: true,
        data: { customId: "node-456" },
      },
    ]);
  });
});
