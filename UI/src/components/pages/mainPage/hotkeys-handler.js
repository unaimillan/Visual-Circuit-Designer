import { useEffect } from "react";

export function useHotkeys(deps, dependencies) {
  useEffect(() => {
    const handleKeyDown = (e) => hotkeyHandler(e, deps);

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, dependencies);
}

function hotkeyHandler(
  e,
  {
    openSettings,
    setOpenSettings,
    copyElements,
    cutElements,
    pasteElements,
    handleSelectAll,
    handleDeselectAll,
    saveCircuit,
    handleSimulateClick,
    simulateState,
    setSimulateState,
    socketRef,
    nodes,
    edges,
    handleOpenClick,
    setActiveAction,
    setPanOnDrag,
    setActiveWire,
  },
) {
  const isCtrlOrCmd = e.ctrlKey || e.metaKey;

  if (isCtrlOrCmd) {
    switch (e.key.toLowerCase()) {
      case "c":
      case "с":
        e.preventDefault();
        copyElements();
        return;
      case "x":
      case "ч":
        e.preventDefault();
        cutElements();
        return;
      case "v":
      case "м":
        e.preventDefault();
        pasteElements();
        return;
      case "a":
      case "ф":
        e.preventDefault();
        handleSelectAll();
        return;
      case "d":
      case "в":
        e.preventDefault();
        handleDeselectAll();
        return;
    }
  }

  if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    setOpenSettings((prev) => !prev);
    return;
  }

  if (isCtrlOrCmd && e.key.toLowerCase() === "s") {
    e.preventDefault();
    saveCircuit();
    return;
  }

  if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    handleSimulateClick({
      simulateState,
      setSimulateState,
      socketRef,
      nodes,
      edges,
    });
    return;
  }

  if (isCtrlOrCmd && e.key.toLowerCase() === "o") {
    e.preventDefault();
    handleOpenClick();
    return;
  }

  if (isCtrlOrCmd && e.key.toLowerCase() === "t") {
    e.preventDefault();
    // handleOpenClick();
    // return;
  }

  const hotkeys = {
    1: () => {
      setActiveAction("cursor");
      setPanOnDrag([2]);
    },
    2: () => {
      setActiveAction("hand");
      setPanOnDrag(true);
    },
    3: () => setActiveAction("eraser"),
    4: () => setActiveAction("text"),
    5: () => setActiveWire("default"),
    6: () => setActiveWire("step"),
    7: () => setActiveWire("straight"),
  };

  if (hotkeys[e.key]) {
    e.preventDefault();
    hotkeys[e.key]();
    return;
  }

  if (e.key === "Escape" && openSettings) {
    setOpenSettings(false);
  }
}
