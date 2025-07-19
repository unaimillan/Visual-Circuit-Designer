import AndNode from "../circuits/basicLogicElements/AND.jsx";
import OrNode from "../circuits/basicLogicElements/OR.jsx";
import NotNode from "../circuits/basicLogicElements/NOT.jsx";
import NandNode from "../circuits/basicLogicElements/NAND.jsx";
import NorNode from "../circuits/basicLogicElements/NOR.jsx";
import XorNode from "../circuits/basicLogicElements/XOR.jsx";
import InputNodeSwitch from "../circuits/IOelemnts/switch.jsx";
import InputNodeButton from "../circuits/IOelemnts/button.jsx";
import OutputNodeLed from "../circuits/IOelemnts/led.jsx";
import SwitchNode from "../circuits/IOelemnts/switch.jsx";
import CustomBlock from "../circuits/customBlock.jsx";

export const nodeTypes = {
  andNode: AndNode,
  orNode: OrNode,
  notNode: NotNode,
  nandNode: NandNode,
  norNode: NorNode,
  xorNode: XorNode,
  inputNodeSwitch: InputNodeSwitch,
  inputNodeButton: InputNodeButton,
  outputNodeLed: OutputNodeLed,
  switchNode: SwitchNode,
  customBlock: CustomBlock,
};
