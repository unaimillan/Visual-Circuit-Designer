import { calculatePosition } from "./calculatePosition.js";

export function pasteElements({
  clipboard,
  mousePosition,
  reactFlowInstance,
  setNodes,
  setEdges,
  newId,
}) {
  if (!reactFlowInstance) {
    console.error("React Flow instance not available");
    return;
  }

  setNodes((prev) => prev.map((node) => ({ ...node, selected: false })));
  setEdges((prev) => prev.map((edge) => ({ ...edge, selected: false })));

  if (clipboard.nodes.length === 0) return;

  const rawPos = reactFlowInstance.screenToFlowPosition({
    x: mousePosition.x,
    y: mousePosition.y,
  });

  const position = calculatePosition(rawPos, clipboard.nodes[0].type);

  const offset = {
    x: position.x - clipboard.nodes[0].position.x,
    y: position.y - clipboard.nodes[0].position.y,
  };

  const nodeIdMap = {};
  const newNodes = clipboard.nodes.map((node) => {
    const id = type + "_" + newId();
    nodeIdMap[node.id] = id;

    return {
      ...node,
      id,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
      selected: true,
      data: {
        ...node.data,
        customId: newId(),
      },
    };
  });

  const newEdges = clipboard.edges.map((edge) => ({
    ...edge,
    id: newId(),
    source: nodeIdMap[edge.source] || edge.source,
    target: nodeIdMap[edge.target] || edge.target,
  }));

  setNodes((prev) => prev.concat(newNodes));
  setEdges((prev) => prev.concat(newEdges));
}
