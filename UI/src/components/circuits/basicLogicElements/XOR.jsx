import LogicGateBase from "../../codeComponents/LogicGateBase.jsx";
import { IconXOR } from "../../../../assets/circuits-icons.jsx";
import { GATE_HANDLE_CONFIGS } from "../../codeComponents/handleConfigs.js";

function XorNode({ id, data, isConnectable }) {
  return (
    <LogicGateBase
      id={id}
      data={data}
      isConnectable={isConnectable}
      IconComponent={IconXOR}
      handleConfigs={GATE_HANDLE_CONFIGS.XOR}
    />
  );
}

export default XorNode;
