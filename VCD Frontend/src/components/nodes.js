import AndNode from './AND.jsx';
import OrNode from "./OR.jsx";
import NotNode from './NOT.jsx';
import NandNode from './NAND.jsx';
import NorNode from "./NOR.jsx";
import XorNode from "./XOR.jsx";

export const nodeTypes = {
  andNode: AndNode,
  orNode: OrNode,
  notNode: NotNode,
  nandNode: NandNode,
  norNode: NorNode,
  xorNode: XorNode,
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