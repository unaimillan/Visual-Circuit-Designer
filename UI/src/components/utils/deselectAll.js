export function deselectAll(nodes, edges) {
  const newNodes = nodes.map((node) => ({ ...node, selected: false }));
  const newEdges = edges.map((edge) => ({ ...edge, selected: false }));

  return { nodes: newNodes, edges: newEdges };
}
