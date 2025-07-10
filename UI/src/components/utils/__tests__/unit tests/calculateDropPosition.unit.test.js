import { calculatePosition } from "../../calculatePosition.js";

jest.mock("../../../constants/nodeSizes", () => ({
  NODE_SIZES: {
    default: { width: 10, height: 20 },
    foo: { width: 100, height: 80 },
    bar: { width: 60, height: 120 },
  },
}));

describe("calculateDropPosition", () => {
  it("offsets correctly for known type 'foo'", () => {
    const rawPos = { x: 150, y: 200 };
    const result = calculatePosition(rawPos, "foo");
    expect(result).toEqual({
      x: 100,
      y: 160,
    });
  });

  it("offsets correctly for known type 'bar'", () => {
    const rawPos = { x: 50, y: 75 };
    const result = calculatePosition(rawPos, "bar");
    expect(result).toEqual({
      x: 20,
      y: 15,
    });
  });

  it("falls back to default size for unknown type", () => {
    const rawPos = { x: 100, y: 100 };
    const result = calculatePosition(rawPos, "unknown");
    expect(result).toEqual({
      x: 95,
      y: 90,
    });
  });
});
