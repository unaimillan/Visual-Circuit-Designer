export function getSelectedElements(nodes, edges) {
  const selectedNodes = nodes.filter((node) => node.selected);
  const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));

  const selectedEdges = edges.filter(
    (edge) =>
      edge.selected &&
      selectedNodeIds.has(edge.source) &&
      selectedNodeIds.has(edge.target),
  );

  return { nodes: selectedNodes, edges: selectedEdges };
}
