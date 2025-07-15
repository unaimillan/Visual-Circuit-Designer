import { copyElements } from "../../copyElements";

describe("copyElements", () => {
  let getSelectedElements, setClipboard, consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    setClipboard = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should do nothing if no gates are selected", () => {
    getSelectedElements = jest.fn(() => ({ nodes: [], edges: [] }));

    copyElements({ getSelectedElements, setClipboard });

    expect(setClipboard).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should copy selected elements and log the action", () => {
    const mockSelection = {
      nodes: [{ id: "1" }, { id: "2" }],
      edges: [{ id: "e1" }],
    };
    getSelectedElements = jest.fn(() => mockSelection);

    copyElements({ getSelectedElements, setClipboard });

    expect(setClipboard).toHaveBeenCalledWith(mockSelection);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Copied:",
      2,
      "nodes and",
      1,
      "edges",
    );
  });
});
