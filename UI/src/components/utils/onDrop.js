import { calculatePosition } from "./calculatePosition.js";

export function onDrop(event, reactFlowInstance, newId, setNodes) {
  event.preventDefault();
  const type = event.dataTransfer.getData("application/reactflow");
  if (!type || !reactFlowInstance) return;

  const rawPos = reactFlowInstance.screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  const position = calculatePosition(
    rawPos,
    type,
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
