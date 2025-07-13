import React, { useRef, useEffect } from "react";
import { IconCloseCross } from "../../../../assets/ui-icons.jsx";
import { initializeTabHistory } from "../../utils/initializeTabHistory.js";

export default function TabsContainer({
  tabs,
  activeTabId,
  onTabsChange,
  onActiveTabIdChange,
}) {
  const scrollRef = useRef(null);
  const textareaRefs = useRef({});

  // Wheel event for horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        const SCROLL_SPEED = 1.5;
        el.scrollLeft += e.deltaY * SCROLL_SPEED;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

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
    const updated = tabs.filter((t) => t.id !== id);
    onTabsChange(updated);
    if (id === activeTabId && updated.length > 0) {
      onActiveTabIdChange(updated[0].id);
    }
  };

  const updateTabTitle = (id, newTitle) => {
    const updated = tabs.map((t) =>
      t.id === id ? { ...t, title: newTitle } : t,
    );
    onTabsChange(updated);
  };

  return (
    <div className="tabs-scroll-container">
      <div className="main-tabs-wrapper" ref={scrollRef}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? "active" : ""}`}
            onClick={() => onActiveTabIdChange(tab.id)}
          >
            <textarea
              ref={(el) => {
                textareaRefs.current[tab.id] = el;
                if (el) {
                  el.style.width = "auto";
                  el.style.width = `${el.scrollWidth}px`;
                }
              }}
              className="name-text-area"
              value={tab.title}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                const { value } = e.target;
                updateTabTitle(tab.id, value);
                const textarea = textareaRefs.current[tab.id];
                if (textarea) {
                  textarea.style.width = "auto";
                  textarea.style.width = `${textarea.scrollWidth}px`;
                }
              }}
              placeholder="Tab name"
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
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
    </div>
  );
}
