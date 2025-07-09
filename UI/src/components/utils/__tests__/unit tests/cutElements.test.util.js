import { cutElements } from '../../cutElements';

describe('cutElements', () => {
  let getSelectedElements, setClipboard, deleteSelectedElements, consoleSpy;

  beforeEach(() => {
    setClipboard = jest.fn();
    deleteSelectedElements = jest.fn();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('does nothing if no nodes and no edges are selected', () => {
    getSelectedElements = jest.fn(() => ({ nodes: [], edges: [] }));

    cutElements({ getSelectedElements, setClipboard, deleteSelectedElements });

    expect(setClipboard).not.toHaveBeenCalled();
    expect(deleteSelectedElements).not.toHaveBeenCalled();
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('cuts selected elements and logs the operation', () => {
    const selected = {
      nodes: [{ id: '1' }],
      edges: [{ id: 'e1' }],
    };
    getSelectedElements = jest.fn(() => selected);

    cutElements({ getSelectedElements, setClipboard, deleteSelectedElements });

    expect(setClipboard).toHaveBeenCalledWith(selected);
    expect(deleteSelectedElements).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Cut:', 1, 'nodes and', 1, 'edges');
  });
});