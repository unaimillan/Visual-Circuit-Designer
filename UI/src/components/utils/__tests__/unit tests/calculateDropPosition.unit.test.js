import { calculateDropPosition } from "../../calculateDropPosition.js";

describe("calculateDropPosition", () => {
  const makeEvent = (x, y) => ({ clientX: x, clientY: y });
  const fakeScreenToFlow = jest.fn(({ x, y }) => ({ x: x + 20, y: y + 30 }));

  const nodeSize = { width: 100, height: 80 };

  beforeEach(() => {
    fakeScreenToFlow.mockClear();
  });

  it("offsets by half of width and half of height of node", () => {
    const evt = makeEvent(50, 60);
    const pos = calculateDropPosition(evt, fakeScreenToFlow, nodeSize);

    expect(fakeScreenToFlow).toHaveBeenCalledWith({ x: 50, y: 60 });
    expect(pos).toEqual({ x: 20, y: 50 });
  });

  it("works correctly for other coordinates", () => {
    const evt = makeEvent(200, 150);
    const pos = calculateDropPosition(evt, fakeScreenToFlow, nodeSize);

    expect(pos).toEqual({ x: 170, y: 140 });
  });

  it("supports nodes with unique sizes", () => {
    const customSize = { width: 60, height: 120 };
    const evt = makeEvent(10, 20);
    const pos = calculateDropPosition(evt, fakeScreenToFlow, customSize);

    expect(pos).toEqual({ x: 0, y: -10 });
  });
});
