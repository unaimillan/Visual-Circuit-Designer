const { isValidConnection } = require("../flowHelpers");

describe("isValidConnection", () => {
  it("returns false when source equals to target", () => {
    expect(
      isValidConnection({ source: "A", target: "A", targetHandle: "h" }, []),
    ).toBe(false);
  });

  it("prohibit multiple wires in targetHandle", () => {
    const edges = [{ target: "T", targetHandle: "h1" }];
    expect(
      isValidConnection(
        { source: "S", target: "T", targetHandle: "h1" },
        edges,
      ),
    ).toBe(false);
  });

  it("satisfies correct connection", () => {
    const edges = [{ target: "T", targetHandle: "h1" }];
    expect(
      isValidConnection(
        { source: "S", target: "T", targetHandle: "h2" },
        edges,
      ),
    ).toBe(true);
  });
});
