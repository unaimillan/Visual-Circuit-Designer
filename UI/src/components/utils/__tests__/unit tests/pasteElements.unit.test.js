import { pasteElements } from '../../pasteElements';

describe('pasteElements', () => {
  const mockSetNodes = jest.fn((fn) => fn([]));
  const mockSetEdges = jest.fn((fn) => fn([]));
  const mockNewId = jest.fn(() => 'new-id');

  const mockReactFlowInstance = {
    screenToFlowPosition: jest.fn(() => ({ x: 50, y: 50 })),
  };

  const clipboard = {
    nodes: [
      {
        id: '1',
        position: { x: 10, y: 10 },
        data: { customId: 'old' },
      },
    ],
    edges: [
      {
        id: 'e1',
        source: '1',
        target: '1',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing if reactFlowInstance is null', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    pasteElements({
      clipboard,
      mousePosition: { x: 0, y: 0 },
      reactFlowInstance: null,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      newId: mockNewId,
    });

    expect(consoleSpy).toHaveBeenCalledWith('React Flow instance not available');
  });

  it('does nothing if clipboard is empty', () => {
    pasteElements({
      clipboard: { nodes: [], edges: [] },
      mousePosition: { x: 0, y: 0 },
      reactFlowInstance: mockReactFlowInstance,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      newId: mockNewId,
    });

    expect(mockSetNodes).toHaveBeenCalledTimes(1); // for deselection
    expect(mockSetEdges).toHaveBeenCalledTimes(1); // for deselection
  });

  it('pastes gates and wires with offset', () => {
    pasteElements({
      clipboard,
      mousePosition: { x: 50, y: 50 },
      reactFlowInstance: mockReactFlowInstance,
      setNodes: mockSetNodes,
      setEdges: mockSetEdges,
      newId: mockNewId,
    });

    expect(mockSetNodes).toHaveBeenCalledTimes(2); // deselect + add
    expect(mockSetEdges).toHaveBeenCalledTimes(2); // deselect + add
    expect(mockNewId).toHaveBeenCalled();
  });
});