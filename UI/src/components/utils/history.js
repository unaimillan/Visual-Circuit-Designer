import { debounce } from 'lodash';

const HISTORY_LIMIT = 100;

export const initializeTabHistory = (tab) => ({
  ...tab,
  history: [{
    nodes: tab.nodes || [],
    edges: tab.edges || []
  }],
  index: 0
});

export const createHistoryUpdater = (setTabs, activeTabId, delay = 200) => {
  return debounce((newNodes, newEdges) => {
    setTabs(tabs => tabs.map(tab => {
      if (tab.id !== activeTabId) return tab;

      const newHistory = tab.history.slice(0, tab.index + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });

      return {
        ...tab,
        history: newHistory.slice(-HISTORY_LIMIT),
        index: Math.min(newHistory.length - 1, HISTORY_LIMIT - 1)
      };
    }));
  }, delay);
};

export const undo = (tabs, activeTabId, setTabs, setNodes, setEdges) => {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab || tab.index <= 0) return;

  const newIndex = tab.index - 1;
  const newState = tab.history[newIndex];

  setTabs(tabs.map(t =>
    t.id === activeTabId ? { ...t, index: newIndex } : t
  ));

  setNodes(newState.nodes);
  setEdges(newState.edges);
};

export const redo = (tabs, activeTabId, setTabs, setNodes, setEdges) => {
  const tab = tabs.find(t => t.id === activeTabId);
  if (!tab || tab.index >= tab.history.length - 1) return;

  const newIndex = tab.index + 1;
  const newState = tab.history[newIndex];

  setTabs(tabs.map(t =>
    t.id === activeTabId ? { ...t, index: newIndex } : t
  ));

  setNodes(newState.nodes);
  setEdges(newState.edges);
};