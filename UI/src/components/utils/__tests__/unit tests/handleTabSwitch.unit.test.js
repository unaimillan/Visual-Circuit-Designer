import { handleTabSwitch } from '../../handleTabSwitch';

describe('handleTabSwitch', () => {
  it('should update active tab history and switch tab', () => {
    const setTabs = jest.fn((updater) => {
      const tabs = [
        {
          id: 'tab1',
          history: [
            { nodes: [{ id: 'a' }], edges: [{ id: 'e1' }] },
          ],
          index: 0,
        },
        { id: 'tab2', history: [], index: 0 },
      ];

      const updatedTabs = updater(tabs);

      expect(updatedTabs[0].history[0]).toEqual({
        nodes: [{ id: 'updated' }],
        edges: [{ id: 'newEdge' }],
      });
    });

    const setActiveTabId = jest.fn();

    handleTabSwitch({
      activeTabId: 'tab1',
      newTabId: 'tab2',
      setTabs,
      setActiveTabId,
      nodes: [{ id: 'updated' }],
      edges: [{ id: 'newEdge' }],
    });

    expect(setTabs).toHaveBeenCalledTimes(1);
    expect(setActiveTabId).toHaveBeenCalledWith('tab2');
  });

  it('should only switch tab if no activeTabId', () => {
    const setTabs = jest.fn();
    const setActiveTabId = jest.fn();

    handleTabSwitch({
      activeTabId: null,
      newTabId: 'tab2',
      setTabs,
      setActiveTabId,
      nodes: [],
      edges: [],
    });

    expect(setTabs).not.toHaveBeenCalled();
    expect(setActiveTabId).toHaveBeenCalledWith('tab2');
  });
});
