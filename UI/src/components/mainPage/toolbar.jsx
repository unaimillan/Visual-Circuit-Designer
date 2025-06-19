import React from "react";
import {IconStop, IconLoading, IconStart} from "../../../assets/ui-icons.jsx";

import {
  IconToolbarCursor,
  IconToolbarEraser,
  IconToolbarHand,
  IconToolbarSquareWire,
  IconToolbarDiagWire,
  IconToolbarText
} from "../../../assets/toolbar-icons.jsx";

export default function Toolbar({ simulateState, activeButton, setActiveButton, setPanOnDrag, onSimulateClick}) {
  return (
    <div className="toolbar">
      <button
        className={`simulate-button ${simulateState}`}
        onClick={onSimulateClick}

      >
        {simulateState === "idle" && (
          <IconStart SVGClassName="simulate-button-svg idle" draggable="false" />
        )}
        {simulateState === "awaiting" && (
          <IconLoading SVGClassName="simulate-button-svg awaiting" draggable="false" />
        )}
        {simulateState === "running" && (
          <IconStop SVGClassName="simulate-button-svg running" draggable="false" />
        )}
      </button>

      <div className="toolbar-separator"></div>

      <button
        className={`toolbarButton ${activeButton === "cursor" ? "active" : ""}`}
        onClick={() => {
          setActiveButton("cursor");
          setPanOnDrag([1, 2]);
        }}
      >
        <IconToolbarCursor SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <button
        className={`toolbarButton ${activeButton === "hand" ? "active" : ""}`}
        onClick={() => {
          setActiveButton("hand");
          setPanOnDrag(true);
        }}
      >
        <IconToolbarHand SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <button
        className={`toolbarButton ${activeButton === "sqwire" ? "active" : ""}`}
        onClick={() => setActiveButton("sqwire")}
      >
        <IconToolbarSquareWire SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <button
        className={`toolbarButton ${activeButton === "dwire" ? "active" : ""}`}
        onClick={() => setActiveButton("dwire")}
      >
        <IconToolbarDiagWire SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <button
        className={`toolbarButton ${activeButton === "eraser" ? "active" : ""}`}
        onClick={() => setActiveButton("eraser")}
      >
        <IconToolbarEraser SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <button
        className={`toolbarButton ${activeButton === "text" ? "active" : ""}`}
        onClick={() => setActiveButton("text")}
      >
        <IconToolbarText SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>
    </div>
  );
}
