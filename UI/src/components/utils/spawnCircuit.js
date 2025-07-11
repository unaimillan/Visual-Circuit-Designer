import { calculatePosition } from "./calculatePosition.js";

export function spawnCircuit(type, reactFlowInstance, setNodes, newId) {
  if (!reactFlowInstance) return;

  const rawPos = reactFlowInstance.screenToFlowPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const position = calculatePosition(rawPos, type);

  const id = type + "_" + newId();
  const newNode = {
    id: id,
    type,
    position,
    selected: true,
    data: {
      customId: newId(),
    },
  };

  setNodes((nds) => nds.concat(newNode));
}
