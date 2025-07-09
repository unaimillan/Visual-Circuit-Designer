export function hotkeyHandler(e, context) {
  const {
    openSettings,
    setOpenSettings,
    copyElements,
    cutElements,
    pasteElements,
    selectAll,
    deselectAll,
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
  } = context;

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
        selectAll();
        return;
      case "d":
      case "в":
        e.preventDefault();
        deselectAll();
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
