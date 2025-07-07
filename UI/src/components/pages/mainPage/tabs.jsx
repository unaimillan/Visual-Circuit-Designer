import React from "react";
import { IconCloseCross } from "../../../../assets/ui-icons.jsx";

export default function TabsContainer({
                                        tabs,
                                        activeTabId,
                                        onTabsChange,
                                        onActiveTabIdChange,
                                      }) {
  const addTab = () => {
    const newTab = {
      id: Date.now(),
      title: "Новая вкладка!",
      nodes: [],
      edges: [],
    };
    onTabsChange([...tabs, newTab]);
    onActiveTabIdChange(newTab.id);
  };

  const removeTab = (id) => {
    const updatedTabs = tabs.filter(tab => tab.id !== id);
    onTabsChange(updatedTabs);
    // Если удалили активную — делаем активной первую оставшуюся
    if (id === activeTabId && updatedTabs.length > 0) {
      onActiveTabIdChange(updatedTabs[0].id);
    }
  };

  const updateTabTitle = (id, newTitle) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === id ? { ...tab, title: newTitle } : tab
    );
    onTabsChange(updatedTabs);
  };

  return (
    <div className="main-tabs-wrapper">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`tab ${tab.id === activeTabId ? "active" : ""}`}
          onClick={() => onActiveTabIdChange(tab.id)}
        >
          <textarea
            className="name-text-area"
            value={tab.title}
            onClick={e => e.stopPropagation()}
            onChange={e => updateTabTitle(tab.id, e.target.value)}
            placeholder="Название вкладки"
          />

          {tabs.length > 1 && (
            <button
              className="close-btn"
              onClick={e => {
                e.stopPropagation();
                removeTab(tab.id);
              }}
            >
              <IconCloseCross SVGClassName="close-tab-cross" />
            </button>
          )}
        </div>
      ))}

      <button className="add-btn" onClick={addTab}>＋</button>
    </div>
  );
}
