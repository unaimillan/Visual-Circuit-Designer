export const createHistoryUpdater = () => {
  return {
    record: (tab, nodes, edges) => {
      const lastState = tab.history[tab.index];
      const nodesChanged =
        JSON.stringify(lastState.nodes) !== JSON.stringify(nodes);
      const edgesChanged =
        JSON.stringify(lastState.edges) !== JSON.stringify(edges);

      if (!nodesChanged && !edgesChanged) return tab;

      const newHistory = tab.history.slice(0, tab.index + 1);
      newHistory.push({ nodes, edges });

      return {
        ...tab,
        history: newHistory,
        index: newHistory.length - 1,
      };
    },
    undo: (tab) => {
      if (tab.index <= 0) return tab;
      return {
        ...tab,
        index: tab.index - 1,
      };
    },
    redo: (tab) => {
      if (tab.index >= tab.history.length - 1) return tab;
      return {
        ...tab,
        index: tab.index + 1,
      };
    },
  };
};
