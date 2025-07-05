import LogicGateBase from "../../codeComponents/LogicGateBase.jsx";
import { IconOR } from "../../../../assets/circuits-icons.jsx";
import { GATE_HANDLE_CONFIGS } from "../../codeComponents/handleConfigs.js";

function OrNode({ id, data, isConnectable }) {
  return (
    <LogicGateBase
      id={id}
      data={data}
      isConnectable={isConnectable}
      IconComponent={IconOR}
      handleConfigs={GATE_HANDLE_CONFIGS.OR}
    />
  );
}

export default OrNode;
