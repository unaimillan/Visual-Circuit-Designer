import {
  IconStop,
  IconLoading,
  IconStart,
  IconError,
  IconDownloadFile,
  IconOpenFile,
  IconUndo,
  IconRedo,
} from "../../../../assets/ui-icons.jsx";

import {
  IconToolbarBezierWire,
  IconToolbarCursor,
  IconToolbarEraser,
  IconToolbarHand,
  IconToolbarStepWire,
  IconToolbarStraightWire,
  IconToolbarText,
} from "../../../../assets/toolbar-icons.jsx";

export default function Toolbar({
  simulateState,
  activeAction,
  setActiveAction,
  activeWire,
  setActiveWire,
  setPanOnDrag,
  onSimulateClick,
  saveCircuit,
  loadCircuit,
  fileInputRef,
  handleOpenClick,
  undo,
  redo,
  canUndo,
  canRedo,
}) {
  return (
    <div>
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
          <IconToolbarCursor
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <button
          className={`toolbarButton ${activeAction === "hand" ? "active" : ""}`}
          onClick={() => {
            setActiveAction("hand");
            setPanOnDrag(true);
          }}
        >
          <IconToolbarHand
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <button
          className={`toolbarButton ${activeAction === "eraser" ? "active" : ""}`}
          onClick={() => setActiveAction("eraser")}
        >
          <IconToolbarEraser
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <button
          className={`toolbarButton ${activeAction === "text" ? "active" : ""}`}
          onClick={() => setActiveAction("text")}
        >
          <IconToolbarText
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <div className="toolbar-separator"></div>

        <button
          className={`toolbarButton ${activeWire === "default" ? "active" : ""}`}
          onClick={() => {
            setActiveWire("default");
          }}
        >
          <IconToolbarBezierWire
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <button
          className={`toolbarButton ${activeWire === "step" ? "active" : ""}`}
          onClick={() => {
            setActiveWire("step");
          }}
        >
          <IconToolbarStepWire
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
          <IconToolbarStraightWire
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <div className="toolbar-separator"></div>

        <button
          onClick={undo}
          disabled={!canUndo}
          className="toolbarButton"
          title="Undo (Ctrl+Z)"
        >
          <IconUndo
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="toolbarButton"
          title="Redo (Ctrl+Y)"
        >
          <IconRedo
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>
      </div>

      <div className="toolbar download">
        <button className={`toolbarButton`} onClick={saveCircuit}>
          <IconDownloadFile
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <div className="toolbar-separator"></div>

        <button className={`toolbarButton `} onClick={handleOpenClick}>
          <IconOpenFile
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>
        <input
          className={`hidden `}
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={loadCircuit}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
