import { hotkeyHandler } from '../hotkeyHandler';

describe('hotkeyHandler', () => {
  const createContext = () => ({
    openSettings: true,
    setOpenSettings: jest.fn(),
    copyElements: jest.fn(),
    cutElements: jest.fn(),
    pasteElements: jest.fn(),
    handleSelectAll: jest.fn(),
    handleDeselectAll: jest.fn(),
    saveCircuit: jest.fn(),
    handleSimulateClick: jest.fn(),
    simulateState: 'idle',
    setSimulateState: jest.fn(),
    socketRef: { current: {} },
    nodes: [],
    edges: [],
    handleOpenClick: jest.fn(),
    setActiveAction: jest.fn(),
    setPanOnDrag: jest.fn(),
    setActiveWire: jest.fn(),
  });

  const makeEvent = (key, ctrlKey = true, shiftKey = false) => ({
    key,
    ctrlKey,
    shiftKey,
    metaKey: false,
    preventDefault: jest.fn(),
  });

  it('calls copyElements on Ctrl+C', () => {
    const ctx = createContext();
    const e = makeEvent('c');
    hotkeyHandler(e, ctx);
    expect(e.preventDefault).toHaveBeenCalled();
    expect(ctx.copyElements).toHaveBeenCalled();
  });

  it('calls cutElements on Ctrl+X', () => {
    const ctx = createContext();
    const e = makeEvent('x');
    hotkeyHandler(e, ctx);
    expect(ctx.cutElements).toHaveBeenCalled();
  });

  it('calls setOpenSettings on Ctrl+Shift+S', () => {
    const ctx = createContext();
    const e = makeEvent('s', true, true);
    hotkeyHandler(e, ctx);
    expect(ctx.setOpenSettings).toHaveBeenCalled();
  });

  it('calls handleSimulateClick on Ctrl+Shift+R', () => {
    const ctx = createContext();
    const e = makeEvent('r', true, true);
    hotkeyHandler(e, ctx);
    expect(ctx.handleSimulateClick).toHaveBeenCalledWith({
      simulateState: 'idle',
      setSimulateState: ctx.setSimulateState,
      socketRef: ctx.socketRef,
      nodes: [],
      edges: [],
    });
  });

  it('calls setActiveAction and setPanOnDrag on "1"', () => {
    const ctx = createContext();
    const e = makeEvent('1', false);
    hotkeyHandler(e, ctx);
    expect(ctx.setActiveAction).toHaveBeenCalledWith('cursor');
    expect(ctx.setPanOnDrag).toHaveBeenCalledWith([2]);
  });
});