function getSelectedElements(nodes, edges) {
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

function isValidConnection({ source, target, targetHandle }, edges) {
  if (source === target) return false;
  return !edges.some(
    (e) => e.target === target && e.targetHandle === targetHandle,
  );
}

export { getSelectedElements, isValidConnection };
