import LogicGateBase from "../../codeComponents/LogicGateBase.jsx";
import { IconNOT } from "../../../../assets/circuits-icons.jsx";
import { GATE_HANDLE_CONFIGS, getNotGateHandleStyle } from "../../codeComponents/handleConfigs.js";

function NotNode({ id, data, isConnectable }) {
  return (
    <LogicGateBase
      id={id}
      data={data}
      isConnectable={isConnectable}
      IconComponent={IconNOT}
      handleConfigs={GATE_HANDLE_CONFIGS.NOT}
      getHandleStyleOverrides={getNotGateHandleStyle}
    />
  );
}

export default NotNode;