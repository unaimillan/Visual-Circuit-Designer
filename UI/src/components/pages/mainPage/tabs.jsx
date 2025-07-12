import React from "react";
import { IconCloseCross } from "../../../../assets/ui-icons.jsx";
import { initializeTabHistory } from "../../utils/history.js";

// Что надо сделать:
// 1) хендлить много вкладок (уменьшать их размер или делать горизонтальный скролл)
// 2) исправить хоткеи, чтобы можно было писать цифры в названии вкладок
// 3) исправить css
// 4) добавить горячие клавиши для перехода по вкладкам и для открытия закрытия вкладок
// 5) добавить отслеживание несохраненных изменений и показывать toast уведу об этом как в браузере +-
// 6) сделать редактирование text-area по двойному клику
// 7) добавить возможность перемещения табов (пиздец)

export default function TabsContainer({
                                        tabs,
                                        activeTabId,
                                        onTabsChange,
                                        onActiveTabIdChange,
                                      }) {
  const addTab = () => {
    const newTab = initializeTabHistory({
      id: Date.now(),
      title: "New Tab",
      nodes: [],
      edges: [],
    });
    onTabsChange([...tabs, newTab]);
    onActiveTabIdChange(newTab.id);
  };

  const removeTab = (id) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    onTabsChange(updatedTabs);

    if (id === activeTabId && updatedTabs.length > 0) {
      onActiveTabIdChange(updatedTabs[0].id);
    }
  };

  const updateTabTitle = (id, newTitle) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, title: newTitle } : tab,
    );
    onTabsChange(updatedTabs);
  };

  return (
    <div className="main-tabs-wrapper">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${tab.id === activeTabId ? "active" : ""}`}
          onClick={() => onActiveTabIdChange(tab.id)}
        >
          <textarea
            className="name-text-area"
            value={tab.title}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateTabTitle(tab.id, e.target.value)}
            placeholder="Tab name"
            onKeyDown={(e) => {
              // Prevent Enter key from creating new line
              if (e.key === "Enter") {
                e.preventDefault();
                // e.target.blur();
              }
            }}
          />

          {tabs.length > 1 && (
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tab.id);
              }}
            >
              <IconCloseCross SVGClassName="close-tab-cross" />
            </button>
          )}
        </div>
      ))}

      <button className="add-btn" onClick={addTab}>
        ＋
      </button>
    </div>
  );
}
