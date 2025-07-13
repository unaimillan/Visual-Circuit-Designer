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
          title={"Simulation"}
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
          disabled={activeAction === "cursor"}
          title={"Cursor (Ctrl+1)"}
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
          disabled={activeAction === "hand"}
          title={"Hand (Ctrl+2)"}
        >
          <IconToolbarHand SVGClassName="toolbarButtonIcon" draggable="false" />
        </button>

        <button
          className={`toolbarButton ${activeAction === "eraser" ? "active" : ""}`}
          onClick={() => setActiveAction("eraser")}
          disabled={activeAction === "eraser"}
          title={"Eraser (Ctrl+3)"}
        >
          <IconToolbarEraser
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <button
          className={`toolbarButton ${activeAction === "text" ? "active" : ""}`}
          onClick={() => setActiveAction("text")}
          disabled={activeAction === "text"}
          title={"Text (Ctrl+4)"}
        >
          <IconToolbarText SVGClassName="toolbarButtonIcon" draggable="false" />
        </button>

        <div className="toolbar-separator"></div>

        <button
          className={`toolbarButton ${activeWire === "default" ? "active" : ""}`}
          onClick={() => {
            setActiveWire("default");
          }}
          disabled={activeWire === "default"}
          title={"Default (Ctrl+5)"}
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
          disabled={activeWire === "step"}
          title={"Step (Ctrl+6)"}
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
          disabled={activeWire === "straight"}
          title={"Straight (Ctrl+7)"}
        >
          <IconToolbarStraightWire
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <div className="toolbar-separator"></div>

        <button
          className="toolbarButton"
          onClick={undo}
          disabled={!canUndo}
          title={canUndo ? "Undo (Ctrl+Z)" : "Nothing to undo in this tab"}
        >
          <IconUndo
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <button
          className="toolbarButton"
          onClick={redo}
          disabled={!canRedo}
          title={canRedo ? "Redo (Ctrl+Y)" : "Nothing to redo in this tab"}
        >
          <IconRedo
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>
      </div>

      <div className="toolbar download">
        <button
          className={`toolbarButton`}
          onClick={saveCircuit}
          title={"Download"}
        >
          <IconDownloadFile
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>

        <div className="toolbar-separator"></div>

        <button
          className={`toolbarButton`}
          onClick={handleOpenClick}
          title={"Upload"}
        >
          <IconOpenFile
            SVGClassName="toolbarButtonIcon"
            draggable="false"
          />
        </button>
        <input
          className={`hidden`}
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
