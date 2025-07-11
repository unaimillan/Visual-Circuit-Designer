import { onDrop } from "../../onDrop.js";
import { calculatePosition } from "../../calculatePosition.js";
import { generateId } from "../../generateId.js";

jest.mock("../../calculatePosition.js");
jest.mock("../../generateId.js");

describe("onDrop", () => {
  let event;
  let reactFlowInstance;
  let setNodes;

  beforeEach(() => {
    event = {
      preventDefault: jest.fn(),
      dataTransfer: { getData: jest.fn() },
      clientX: 5,
      clientY: 15,
    };

    reactFlowInstance = {
      screenToFlowPosition: jest.fn().mockReturnValue({ x: 50, y: 75 }),
    };

    calculatePosition.mockReturnValue({ x: 100, y: 200 });

    generateId.mockReturnValueOnce("node-123").mockReturnValueOnce("node-456");

    setNodes = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("does nothing when no type or no instance", () => {
    event.dataTransfer.getData.mockReturnValue("");
    onDrop(event, reactFlowInstance, setNodes);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(setNodes).not.toHaveBeenCalled();

    event.dataTransfer.getData.mockReturnValue("foo");
    onDrop(event, null, setNodes);
    expect(setNodes).not.toHaveBeenCalled();
  });

  it("creates a new node with correct parameters for known type", () => {
    event.dataTransfer.getData.mockReturnValue("foo");

    onDrop(event, reactFlowInstance, setNodes);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(reactFlowInstance.screenToFlowPosition).toHaveBeenCalledWith({
      x: 5,
      y: 15,
    });

    expect(calculatePosition).toHaveBeenCalledWith({ x: 50, y: 75 }, "foo");
    expect(generateId).toHaveBeenCalledTimes(2);

    expect(setNodes).toHaveBeenCalledWith(expect.any(Function));

    const updater = setNodes.mock.calls[0][0];
    const before = [{ id: "existing" }];
    const result = updater(before);
    expect(result).toEqual([
      { id: "existing" },
      {
        id: "node-123",
        type: "foo",
        position: { x: 100, y: 200 },
        selected: true,
        data: { customId: "node-456" },
      },
    ]);
  });

  it("supports unknown types (graceful fallback)", () => {
    event.dataTransfer.getData.mockReturnValue("unknown");

    onDrop(event, reactFlowInstance, setNodes);

    expect(calculatePosition).toHaveBeenCalledWith({ x: 50, y: 75 }, "unknown");
    expect(setNodes).toHaveBeenCalled();
  });
});
