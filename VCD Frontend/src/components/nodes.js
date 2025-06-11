import AndNode from './AND.jsx';
import NotNode from './NOT.jsx';
import OrNode from "./OR.jsx";

export const nodeTypes = {
  andNode: AndNode,
  orNode: OrNode,
  notNode: NotNode,
};

export const initialNodes = [
  {
    id: '0',
    type: 'andNode',
    position: { x: 400, y: 300 },
  },
  {
    id: '3',
    type: 'andNode',
    position: { x: 400, y: 400 },
  },
  {
    id: '1',
    type: 'orNode',
    data: { label: 'bruh' },
    position: { x: 600, y: 350 },
  },
  {
    id: '2',
    type: 'notNode',
    position: { x: 800, y: 350 },
  },
];