import { useCallback } from "react";

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

export function isValidConnection({ source, target, targetHandle }, edges) {
  if (source === target) return false;
  return !edges.some(
    (e) => e.target === target && e.targetHandle === targetHandle,
  );
}

export function selectAll(nodes, edges) {
  const newNodes = nodes.map((node) => ({ ...node, selected: true }));
  const newEdges = edges.map((edge) => ({ ...edge, selected: true }));
  return { nodes: newNodes, edges: newEdges };
}

export function deselectAll(nodes, edges) {
  const newNodes = nodes.map((node) => ({ ...node, selected: false }));
  const newEdges = edges.map((edge) => ({ ...edge, selected: false }));
  return { nodes: newNodes, edges: newEdges };
}
