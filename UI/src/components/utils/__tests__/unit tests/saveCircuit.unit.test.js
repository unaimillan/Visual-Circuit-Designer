import { saveCircuit } from "../../saveCircuit.js"; // путь измените при необходимости

describe("saveCircuit", () => {
  it("should generate and click a download link with correct data", () => {
    const clickMock = jest.fn();
    const removeMock = jest.fn();
    const setAttributeMock = jest.fn();

    const mockAnchor = {
      setAttribute: setAttributeMock,
      click: clickMock,
      remove: removeMock,
    };

    document.createElement = jest.fn().mockReturnValue(mockAnchor);
    document.body.appendChild = jest.fn();

    const nodes = [
      { id: "1", type: "AND", position: { x: 0, y: 0 }, data: {} },
    ];
    const edges = [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        sourceHandle: "a",
        targetHandle: "b",
      },
    ];

    saveCircuit(nodes, edges);

    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(setAttributeMock).toHaveBeenCalledWith(
      "href",
      expect.stringContaining("data:text/json"),
    );
    expect(setAttributeMock).toHaveBeenCalledWith("download", "circuit.json");
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(clickMock).toHaveBeenCalled();
    expect(removeMock).toHaveBeenCalled();
  });
});
