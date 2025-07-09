export function deleteSelectedElements(nodes, edges, clipboard) {
  const selectedNodeIds = new Set(clipboard.nodes.map((n) => n.id));
  const selectedEdgeIds = new Set(clipboard.edges.map((e) => e.id));

  const adjacentEdgeIds = new Set(
    edges
      .filter(
        (edge) =>
          selectedNodeIds.has(edge.source) || selectedNodeIds.has(edge.target),
      )
      .map((e) => e.id),
  );

  adjacentEdgeIds.forEach(selectedEdgeIds.add, selectedEdgeIds);

  const newNodes = nodes.filter((node) => !selectedNodeIds.has(node.id));
  const newEdges = edges.filter(
    (edge) => !selectedEdgeIds.has(edge.id) && !adjacentEdgeIds.has(edge.id),
  );

  console.log(
    "Deleted:",
    clipboard.nodes.length,
    "nodes and",
    selectedEdgeIds.size,
    "edges",
  );

  return { newNodes, newEdges };
}
