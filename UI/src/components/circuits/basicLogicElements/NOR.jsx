import LogicGateBase from "../../codeComponents/LogicGateBase.jsx";
import { IconNOR } from "../../../../assets/circuits-icons.jsx";
import { GATE_HANDLE_CONFIGS } from "../../codeComponents/handleConfigs.js";

function NorNode({ id, data, isConnectable }) {
  return (
    <LogicGateBase
      id={id}
      data={data}
      isConnectable={isConnectable}
      IconComponent={IconNOR}
      handleConfigs={GATE_HANDLE_CONFIGS.NOR}
    />
  );
}

export default NorNode;
