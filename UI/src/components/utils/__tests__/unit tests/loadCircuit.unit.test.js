import { loadCircuit } from "../../loadCircuit.js";

describe("loadCircuit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("loads circuit from file and sets gates and wires", () => {
    const mockSetNodes = jest.fn();
    const mockSetEdges = jest.fn();

    const fileContent = JSON.stringify({
      nodes: [{ id: "1", type: "AND", position: { x: 0, y: 0 }, data: {} }],
      edges: [{ id: "e1", source: "1", target: "2" }],
    });

    const mockFile = new Blob([fileContent], { type: "application/json" });

    const mockEvent = {
      target: {
        files: [mockFile],
      },
    };

    const mockReader = {
      readAsText: jest.fn(),
      onload: null,
    };

    global.FileReader = jest.fn(() => mockReader);

    loadCircuit(mockEvent, mockSetNodes, mockSetEdges);

    expect(mockReader.readAsText).toHaveBeenCalledWith(mockFile);

    mockReader.onload({ target: { result: fileContent } });

    expect(mockSetNodes).toHaveBeenCalledWith([]);
    expect(mockSetEdges).toHaveBeenCalledWith([]);

    jest.advanceTimersByTime(100);

    expect(mockSetNodes).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "1", type: "AND" }),
      ]),
    );

    expect(mockSetEdges).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "e1", source: "1", target: "2" }),
      ]),
    );
  });
});
