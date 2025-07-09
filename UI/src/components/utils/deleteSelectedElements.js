export function deleteSelectedElements(nodes, edges, clipboard) {
  const selectedNodeIds = new Set(clipboard.nodes.map((n) => n.id));
  const selectedEdgeIds = new Set(clipboard.edges.map((e) => e.id));

  const newNodes = nodes.filter((node) => !selectedNodeIds.has(node.id));
  const newEdges = edges.filter((edge) => !selectedEdgeIds.has(edge.id));

  console.log(
    "Deleted:",
    clipboard.nodes.length,
    "nodes and",
    clipboard.edges.length,
    "edges",
  );

  return { newNodes, newEdges };
}
