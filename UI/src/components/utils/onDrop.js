import { calculateDropPosition } from "./calculateDropPosition.js";
import { NODE_SIZES } from "../constants/nodeSizes";

export function onDrop(event, reactFlowInstance, newId, setNodes) {
  event.preventDefault();
  const type = event.dataTransfer.getData("application/reactflow");
  if (!type || !reactFlowInstance) return;

  const nodeSize = NODE_SIZES[type] || NODE_SIZES.default;
  const position = calculateDropPosition(
    event,
    reactFlowInstance.screenToFlowPosition,
    nodeSize,
  );

  const id = newId();
  const newNode = {
    id,
    type,
    position,
    selected: true,
    data: { customId: newId() },
  };

  setNodes((nds) => nds.concat(newNode));
}
