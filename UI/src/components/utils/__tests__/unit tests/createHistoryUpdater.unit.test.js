import { createHistoryUpdater } from "../../createHistoryUpdater";

describe("createHistoryUpdater", () => {
  let updater;
  let initialTab;

  beforeEach(() => {
    updater = createHistoryUpdater();
    initialTab = {
      id: "tab1",
      history: [{ nodes: [{ id: "1" }], edges: [] }],
      index: 0,
    };
  });

  describe("record", () => {
    it("should not record if nodes and edges are unchanged", () => {
      const result = updater.record(initialTab, [{ id: "1" }], []);
      expect(result).toBe(initialTab);
    });

    it("should record new state if nodes changed", () => {
      const newNodes = [{ id: "1" }, { id: "2" }];
      const result = updater.record(initialTab, newNodes, []);
      expect(result.history.length).toBe(2);
      expect(result.index).toBe(1);
      expect(result.history[1]).toEqual({ nodes: newNodes, edges: [] });
    });

    it("should discard future history if recording from middle of history", () => {
      const tab = {
        ...initialTab,
        history: [
          { nodes: [{ id: "1" }], edges: [] },
          { nodes: [{ id: "1" }, { id: "2" }], edges: [] },
        ],
        index: 0,
      };
      const result = updater.record(tab, [{ id: "3" }], []);
      expect(result.history.length).toBe(2);
      expect(result.history[1].nodes).toEqual([{ id: "3" }]);
      expect(result.index).toBe(1);
    });
  });

  describe("undo", () => {
    it("should not undo if already at index 0", () => {
      const result = updater.undo(initialTab);
      expect(result.index).toBe(0);
    });

    it("should decrease index by 1 if possible", () => {
      const tab = {
        ...initialTab,
        history: [
          { nodes: [{ id: "1" }], edges: [] },
          { nodes: [{ id: "1" }, { id: "2" }], edges: [] },
        ],
        index: 1,
      };
      const result = updater.undo(tab);
      expect(result.index).toBe(0);
    });
  });

  describe("redo", () => {
    it("should not redo if already at latest index", () => {
      const result = updater.redo(initialTab);
      expect(result.index).toBe(0);
    });

    it("should increase index by 1 if possible", () => {
      const tab = {
        ...initialTab,
        history: [
          { nodes: [{ id: "1" }], edges: [] },
          { nodes: [{ id: "1" }, { id: "2" }], edges: [] },
        ],
        index: 0,
      };
      const result = updater.redo(tab);
      expect(result.index).toBe(1);
    });
  });
});
