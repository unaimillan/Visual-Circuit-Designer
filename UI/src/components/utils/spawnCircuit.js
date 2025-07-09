export function spawnCircuit(type, reactFlowInstance, simulateState, setNodes) {
  if (!reactFlowInstance) return;

  const position = reactFlowInstance.screenToFlowPosition({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const timestamp = Date.now();
  const newNode = {
    id: `${type}_${timestamp}`,
    type,
    position,
    data: {
      customId: `${type}_${timestamp}`,
      simState: simulateState,
      value: false,
    },
  };

  setNodes((nds) => nds.concat(newNode));
}
