export const redo = (
  tabs,
  activeTabId,
  setTabs,
  setNodes,
  setEdges,
  showWarning,
) => {
  const tab = tabs.find((t) => t.id === activeTabId);
  if (!tab) {
    showWarning("No active tab selected");
    return;
  }

  if (tab.index >= tab.history.length - 1) {
    showWarning("Nothing to redo in this tab");
    return;
  }

  const newIndex = tab.index + 1;
  const newState = tab.history[newIndex];

  setTabs(
    tabs.map((t) => (t.id === activeTabId ? { ...t, index: newIndex } : t)),
  );

  setNodes(newState.nodes);
  setEdges(newState.edges);
};
