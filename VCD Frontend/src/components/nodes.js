import AndNode from './basicLogicElements/AND.jsx';
import OrNode from "./basicLogicElements/OR.jsx";
import NotNode from './basicLogicElements/NOT.jsx';
import NandNode from './basicLogicElements/NAND.jsx';
import NorNode from "./basicLogicElements/NOR.jsx";
import XorNode from "./basicLogicElements/XOR.jsx";
import InputNode from "./IOelemnts/input.jsx"
import OutputNode from "./IOelemnts/output.jsx"

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

];