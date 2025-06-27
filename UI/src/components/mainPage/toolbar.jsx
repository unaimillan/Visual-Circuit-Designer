import React from "react";
import {
  IconStop,
  IconLoading,
  IconStart,
  IconError,
} from "../../../assets/ui-icons.jsx";

import {
  IconToolbarCursor,
  IconToolbarEraser,
  IconToolbarHand,
  IconToolbarSquareWire,
  IconToolbarDiagWire,
  IconToolbarText,
} from "../../../assets/toolbar-icons.jsx";

export default function Toolbar({
  simulateState,
  activeAction,
  setActiveAction,
  activeWire,
  setActiveWire,
  setPanOnDrag,
  onSimulateClick,
}) {
  return (
    <div className="toolbar">
      <button
        className={`simulate-button ${simulateState}`}
        onClick={onSimulateClick}
      >
        {simulateState === "idle" && (
          <IconStart
            SVGClassName="simulate-button-svg idle"
            draggable="false"
          />
        )}
        {simulateState === "awaiting" && (
          <IconLoading
            SVGClassName="simulate-button-svg awaiting"
            draggable="false"
          />
        )}
        {simulateState === "running" && (
          <IconStop
            SVGClassName="simulate-button-svg running"
            draggable="false"
          />
        )}
        {simulateState === "error" && (
          <IconError
            SVGClassName="simulate-button-svg error"
            draggable="false"
          />
        )}
      </button>

      <div className="toolbar-separator"></div>

      <button
        className={`toolbarButton ${activeAction === "cursor" ? "active" : ""}`}
        onClick={() => {
          setActiveAction("cursor");
          setPanOnDrag([2]);
        }}
      >
        <IconToolbarCursor SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <button
        className={`toolbarButton ${activeAction === "hand" ? "active" : ""}`}
        onClick={() => {
          setActiveAction("hand");
          setPanOnDrag(true);
        }}
      >
        <IconToolbarHand SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <div className="toolbar-separator"></div>

      <button
        className={`toolbarButton ${activeWire === "step" ? "active" : ""}`}
        onClick={() => {
          setActiveWire("step");
        }}
      >
        <IconToolbarSquareWire
          SVGClassName="toolbarButtonIcon"
          draggable="false"
        />
      </button>

      <button
        className={`toolbarButton ${activeWire === "straight" ? "active" : ""}`}
        onClick={() => {
          setActiveWire("straight");
        }}
      >
        <IconToolbarDiagWire
          SVGClassName="toolbarButtonIcon"
          draggable="false"
        />
      </button>

      <div className="toolbar-separator"></div>

      <button
        className={`toolbarButton ${activeAction === "eraser" ? "active" : ""}`}
        onClick={() => setActiveAction("eraser")}
      >
        <IconToolbarEraser SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>

      <button
        className={`toolbarButton ${activeAction === "text" ? "active" : ""}`}
        onClick={() => setActiveAction("text")}
      >
        <IconToolbarText SVGClassName="toolbarButtonIcon" draggable="false" />
      </button>
    </div>
  );
}
