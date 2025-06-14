import AndNode from '../basicLogicElements/AND.jsx';
import OrNode from "../basicLogicElements/OR.jsx";
import NotNode from '../basicLogicElements/NOT.jsx';
import NandNode from '../basicLogicElements/NAND.jsx';
import NorNode from "../basicLogicElements/NOR.jsx";
import XorNode from "../basicLogicElements/XOR.jsx";
import InputNode from "../IOelemnts/input.jsx"
import OutputNode from "../IOelemnts/output.jsx"

export const nodeTypes = {
  andNode: AndNode,
  orNode: OrNode,
  notNode: NotNode,
  nandNode: NandNode,
  norNode: NorNode,
  xorNode: XorNode,
  inputNode: InputNode,
  outputNode: OutputNode
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