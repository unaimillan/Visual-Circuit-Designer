export function selectAll(nodes, edges) {
  const newNodes = nodes.map((node) => ({ ...node, selected: true }));
  const newEdges = edges.map((edge) => ({ ...edge, selected: true }));

  return { nodes: newNodes, edges: newEdges };
}