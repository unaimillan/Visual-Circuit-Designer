import LogicGateBase from "../../codeComponents/LogicGateBase.jsx";
import { IconNAND } from "../../../../assets/circuits-icons.jsx";
import { GATE_HANDLE_CONFIGS } from "../../codeComponents/handleConfigs.js";

function NandNode({ id, data, isConnectable }) {
  return (
    <LogicGateBase
      id={id}
      data={data}
      isConnectable={isConnectable}
      IconComponent={IconNAND}
      handleConfigs={GATE_HANDLE_CONFIGS.NAND}
    />
  );
}

export default NandNode;
