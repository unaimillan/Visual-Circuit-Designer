export function spawnCircuit(type, reactFlowInstance, setNodes, newId) {
  if (!reactFlowInstance) return;

  const position = reactFlowInstance.screenToFlowPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const id = newId();
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
