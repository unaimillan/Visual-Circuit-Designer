import AndNode from './AND.jsx';
import OrNode from "./OR.jsx";
import NotNode from './NOT.jsx';
import NandNode from './NAND.jsx';
import NorNode from "./NOR.jsx";
import XorNode from "./XOR.jsx";
import InputNode from "./input.jsx"
import OutputNode from "./output.jsx"

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