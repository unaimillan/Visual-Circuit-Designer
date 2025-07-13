import { redo } from '../../redo';

describe('redo', () => {
  let setTabs, setNodes, setEdges, showWarning;

  beforeEach(() => {
    setTabs = jest.fn();
    setNodes = jest.fn();
    setEdges = jest.fn();
    showWarning = jest.fn();
  });

  it('should show warning if no active tab found', () => {
    const tabs = [{ id: 'tab1', history: [], index: 0 }];
    redo(tabs, 'nonexistent', setTabs, setNodes, setEdges, showWarning);

    expect(showWarning).toHaveBeenCalledWith('No active tab selected');
    expect(setTabs).not.toHaveBeenCalled();
    expect(setNodes).not.toHaveBeenCalled();
    expect(setEdges).not.toHaveBeenCalled();
  });

  it('should show warning if nothing to redo', () => {
    const tabs = [
      {
        id: 'tab1',
        history: [{ nodes: [], edges: [] }],
        index: 0,
      },
    ];
    redo(tabs, 'tab1', setTabs, setNodes, setEdges, showWarning);

    expect(showWarning).toHaveBeenCalledWith('Nothing to redo in this tab');
    expect(setTabs).not.toHaveBeenCalled();
    expect(setNodes).not.toHaveBeenCalled();
    expect(setEdges).not.toHaveBeenCalled();
  });

  it('should update index and set nodes and edges on redo', () => {
    const tabs = [
      {
        id: 'tab1',
        history: [
          { nodes: [{ id: '1' }], edges: [] },
          { nodes: [{ id: '2' }], edges: [{ id: 'e1' }] },
        ],
        index: 0,
      },
    ];

    redo(tabs, 'tab1', setTabs, setNodes, setEdges, showWarning);

    expect(setTabs).toHaveBeenCalledWith([
      {
        id: 'tab1',
        history: [
          { nodes: [{ id: '1' }], edges: [] },
          { nodes: [{ id: '2' }], edges: [{ id: 'e1' }] },
        ],
        index: 1,
      },
    ]);

    expect(setNodes).toHaveBeenCalledWith([{ id: '2' }]);
    expect(setEdges).toHaveBeenCalledWith([{ id: 'e1' }]);
    expect(showWarning).not.toHaveBeenCalled();
  });
});
