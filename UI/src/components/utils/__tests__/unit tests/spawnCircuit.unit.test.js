import { spawnCircuit } from "../../spawnCircuit.js";

test("spawnCircuit creates node with expected structure", () => {
  const mockInstance = {
    screenToFlowPosition: jest.fn(() => ({ x: 100, y: 200 })),
  };
  const mockSetNodes = jest.fn();

  spawnCircuit("AND", mockInstance, "idle", mockSetNodes);

  expect(mockInstance.screenToFlowPosition).toHaveBeenCalled();
  expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Function));

  const updater = mockSetNodes.mock.calls[0][0];
  const updated = updater([]);
  expect(updated[0]).toMatchObject({
    id: expect.stringContaining("AND_"),
    type: "AND",
    position: { x: 100, y: 200 },
    data: {
      customId: expect.stringContaining("AND_"),
      simState: "idle",
      value: false,
    },
  });
});
