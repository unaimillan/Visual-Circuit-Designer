import { calculateDropPosition } from "../../calculateDropPosition.js";
import { NODE_SIZES } from "../../../constants/nodeSizes";
import { onDrop } from "../../onDrop.js";

jest.mock("../../calculateDropPosition.js");
jest.mock("../../../constants/nodeSizes", () => ({
  NODE_SIZES: {
    default: { width: 10, height: 20 },
    foo: { width: 30, height: 40 },
  },
}));

describe("onDrop", () => {
  let event;
  let reactFlowInstance;
  let newId;
  let setNodes;

  beforeEach(() => {
    event = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn(),
      },
      clientX: 5,
      clientY: 15,
    };

    reactFlowInstance = {
      screenToFlowPosition: jest.fn(),
    };

    calculateDropPosition.mockReturnValue({ x: 100, y: 200 });

    newId = jest
      .fn()
      .mockReturnValueOnce("node-123") // for id
      .mockReturnValueOnce("node-456"); // for customId

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

  it("creates a new gate with correct shape for known type", () => {
    event.dataTransfer.getData.mockReturnValue("foo");
    onDrop(event, reactFlowInstance, newId, setNodes);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(calculateDropPosition).toHaveBeenCalledWith(
      event,
      reactFlowInstance.screenToFlowPosition,
      NODE_SIZES.foo,
    );
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

  it("falls back to default size for unknown type", () => {
    event.dataTransfer.getData.mockReturnValue("unknown");
    onDrop(event, reactFlowInstance, newId, setNodes);

    expect(calculateDropPosition).toHaveBeenCalledWith(
      event,
      reactFlowInstance.screenToFlowPosition,
      NODE_SIZES.default,
    );
    expect(setNodes).toHaveBeenCalled();
  });
});
