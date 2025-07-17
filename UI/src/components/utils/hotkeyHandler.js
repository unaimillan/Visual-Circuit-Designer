export function hotkeyHandler(e, context) {
  if (document.activeElement.tagName === 'INPUT' ||
    document.activeElement.tagName === 'TEXTAREA' ||
    document.activeElement.isContentEditable) {
    return;
  }

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
    undo,
    redo,
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
      case "z":
      case "я":
        e.preventDefault();
        undo();
        return;
      case "y":
      case "н":
        e.preventDefault();
        redo();
        return;
    }
  }

  if (
    isCtrlOrCmd &&
    e.shiftKey &&
    (e.key.toLowerCase() === "s" || e.key.toLowerCase() === "ы")
  ) {
    e.preventDefault();
    setOpenSettings((prev) => !prev);
    return;
  }

  if (
    isCtrlOrCmd &&
    (e.key.toLowerCase() === "s" || e.key.toLowerCase() === "ы")
  ) {
    e.preventDefault();
    saveCircuit();
    return;
  }

  if (
    isCtrlOrCmd &&
    e.shiftKey &&
    (e.key.toLowerCase() === "r" || e.key.toLowerCase() === "к")
  ) {
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

  if (
    isCtrlOrCmd &&
    (e.key.toLowerCase() === "o" || e.key.toLowerCase() === "щ")
  ) {
    e.preventDefault();
    handleOpenClick();
    return;
  }

  if (
    isCtrlOrCmd &&
    e.shiftKey &&
    (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "я")
  ) {
    e.preventDefault();
    setOpenSettings((prev) => !prev);
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
