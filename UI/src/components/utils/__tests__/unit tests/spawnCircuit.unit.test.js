import { spawnCircuit } from "../../spawnCircuit";
import { generateId } from "../../generateId";
import { calculatePosition } from "../../calculatePosition";

jest.mock("../../generateId");
jest.mock("../../calculatePosition");

describe("spawnCircuit", () => {
  let mockInstance;
  let mockSetNodes;

  beforeEach(() => {
    mockInstance = {
      screenToFlowPosition: jest.fn(() => ({ x: 100, y: 200 })),
    };
    mockSetNodes = jest.fn();

    generateId
      .mockReturnValueOnce("node-123")
      .mockReturnValueOnce("node-456");

    calculatePosition.mockReturnValue({ x: 70, y: 170 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does nothing if reactFlowInstance is falsy", () => {
    spawnCircuit("AND", null, mockSetNodes);
    expect(mockSetNodes).not.toHaveBeenCalled();
    expect(generateId).not.toHaveBeenCalled();
  });

  it("spawns a gate at center with correct props", () => {
    spawnCircuit("AND", mockInstance, mockSetNodes);

    expect(mockInstance.screenToFlowPosition).toHaveBeenCalledWith({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    expect(generateId).toHaveBeenCalledTimes(2);
    expect(calculatePosition).toHaveBeenCalledWith({ x: 100, y: 200 }, "AND");

    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Function));

    const updater = mockSetNodes.mock.calls[0][0];
    const before = [{ id: "existing-node" }];
    const result = updater(before);

    expect(result).toEqual([
      { id: "existing-node" },
      {
        id: "node-123",
        type: "AND",
        position: { x: 70, y: 170 },
        selected: true,
        data: { customId: "node-456" },
      },
    ]);
  });
});
