import { initializeTabHistory } from '../../initializeTabHistory';

describe('initializeTabHistory', () => {
  it('should initialize history with provided gates and wires', () => {
    const input = {
      id: 'tab1',
      nodes: [{ id: '1' }],
      edges: [{ id: 'e1' }],
    };

    const result = initializeTabHistory(input);

    expect(result).toEqual({
      id: 'tab1',
      nodes: [{ id: '1' }],
      edges: [{ id: 'e1' }],
      history: [
        {
          nodes: [{ id: '1' }],
          edges: [{ id: 'e1' }],
        },
      ],
      index: 0,
    });
  });

  it('should default gates and wires to empty arrays if not provided', () => {
    const input = { id: 'tab2' };

    const result = initializeTabHistory(input);

    expect(result).toEqual({
      id: 'tab2',
      history: [
        {
          nodes: [],
          edges: [],
        },
      ],
      index: 0,
    });
  });
});
