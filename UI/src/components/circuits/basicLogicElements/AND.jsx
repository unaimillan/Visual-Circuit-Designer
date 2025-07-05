import LogicGateBase from "../../codeComponents/LogicGateBase.jsx";
import { IconAND } from "../../../../assets/circuits-icons.jsx";
import { GATE_HANDLE_CONFIGS } from "../../codeComponents/handleConfigs.js";

function AndNode({ id, data, isConnectable }) {
  return (
    <LogicGateBase
      id={id}
      data={data}
      isConnectable={isConnectable}
      IconComponent={IconAND}
      handleConfigs={GATE_HANDLE_CONFIGS.AND}
    />
  );
}

export default AndNode;
