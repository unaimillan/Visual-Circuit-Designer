export const handleTabSwitch = ({
  activeTabId,
  newTabId,
  setTabs,
  setActiveTabId,
  nodes,
  edges,
}) => {
  if (activeTabId != null) {
    setTabs((tabs) =>
      tabs.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        const updatedHistory = [...tab.history];
        updatedHistory[tab.index] = {
          nodes,
          edges,
        };
        return {
          ...tab,
          history: updatedHistory,
        };
      }),
    );
  }
  setActiveTabId(newTabId);
};
