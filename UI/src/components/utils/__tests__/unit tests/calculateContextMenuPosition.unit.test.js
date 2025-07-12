import { calculateContextMenuPosition } from "../../calculateContextMenuPosition.js";

describe("calculateContextMenuPosition", () => {
  const node = { id: "node-1", type: "AND" };

  const eventFactory = (x, y) => ({
    clientX: x,
    clientY: y,
  });

  const container = {
    width: 800,
    height: 600,
  };

  test("positions context menu top-left", () => {
    const event = eventFactory(100, 100);
    const result = calculateContextMenuPosition(event, node, container);
    expect(result).toEqual(
      expect.objectContaining({
        top: 100,
        left: 100,
        right: false,
        bottom: false,
      }),
    );
  });

  test("positions context menu top-right", () => {
    const event = eventFactory(750, 100);
    const result = calculateContextMenuPosition(event, node, container);
    expect(result).toEqual(
      expect.objectContaining({
        top: 100,
        left: false,
        right: 50,
        bottom: false,
      }),
    );
  });

  test("positions context menu bottom-left", () => {
    const event = eventFactory(100, 580);
    const result = calculateContextMenuPosition(event, node, container);
    expect(result).toEqual(
      expect.objectContaining({
        top: false,
        left: 100,
        right: false,
        bottom: 20,
      }),
    );
  });

  test("positions context menu bottom-right", () => {
    const event = eventFactory(780, 580);
    const result = calculateContextMenuPosition(event, node, container);
    expect(result).toEqual(
      expect.objectContaining({
        top: false,
        left: false,
        right: 20,
        bottom: 20,
      }),
    );
  });
});
