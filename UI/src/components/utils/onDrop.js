import { calculatePosition } from "./calculatePosition.js";
import { generateId } from "./generateId.js";

export function onDrop(event, reactFlowInstance, setNodes) {
  event.preventDefault();
  const type = event.dataTransfer.getData("application/reactflow");
  if (!type || !reactFlowInstance) return;

  const rawPos = reactFlowInstance.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  const position = calculatePosition(rawPos, type);

  const id = generateId();
  const newNode = {
    id,
    type,
    position,
    selected: true,
    data: { customId: generateId() },
  };

  setNodes((nds) => nds.concat(newNode));
}
