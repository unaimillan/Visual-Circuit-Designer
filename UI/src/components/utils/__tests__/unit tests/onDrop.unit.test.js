import { onDrop } from "../../onDrop.js";
import { calculateDropPosition } from "../../calculateDropPosition.js";

jest.mock("../../calculateDropPosition.js");

describe("onDrop", () => {
  let event;
  let reactFlowInstance;
  let newId;
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

    calculateDropPosition.mockReturnValue({ x: 100, y: 200 });

    newId = jest
      .fn()
      .mockReturnValueOnce("node-123") // id
      .mockReturnValueOnce("node-456"); // customId

    setNodes = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("does nothing when no type or no instance", () => {
    event.dataTransfer.getData.mockReturnValue("");
    onDrop(event, reactFlowInstance, newId, setNodes);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(setNodes).not.toHaveBeenCalled();

    event.dataTransfer.getData.mockReturnValue("foo");
    onDrop(event, null, newId, setNodes);
    expect(setNodes).not.toHaveBeenCalled();
  });

  it("creates a new node with correct parameters for known type", () => {
    event.dataTransfer.getData.mockReturnValue("foo");

    onDrop(event, reactFlowInstance, newId, setNodes);

    expect(event.preventDefault).toHaveBeenCalled();

    const rawPos = { x: 50, y: 75 };
    expect(reactFlowInstance.screenToFlowPosition).toHaveBeenCalledWith({
      x: 5,
      y: 15,
    });

    expect(calculateDropPosition).toHaveBeenCalledWith(rawPos, "foo");

    expect(newId).toHaveBeenCalledTimes(2);

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

  it("falls back gracefully for unknown type", () => {
    event.dataTransfer.getData.mockReturnValue("unknown");

    onDrop(event, reactFlowInstance, newId, setNodes);

    expect(calculateDropPosition).toHaveBeenCalledWith(
      { x: 50, y: 75 },
      "unknown"
    );
    expect(setNodes).toHaveBeenCalled();
  });
});
