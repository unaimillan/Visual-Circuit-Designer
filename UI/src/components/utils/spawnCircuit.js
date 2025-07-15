import { calculatePosition } from "./calculatePosition.js";
import { generateId } from "./generateId.js";

export function spawnCircuit(type, reactFlowInstance, setNodes) {
  if (!reactFlowInstance) return;

  const rawPos = reactFlowInstance.screenToFlowPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const position = calculatePosition(rawPos, type);

  const id = generateId();
  const newNode = {
    id: id,
    type,
    position,
    selected: true,
    data: {
      customId: generateId(),
    },
  };

  setNodes((nds) => nds.concat(newNode));
}
