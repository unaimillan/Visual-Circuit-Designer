export function isValidConnection({ source, target, targetHandle }, edges) {
  if (source === target) return false;

  return !edges.some(
    (e) => e.target === target && e.targetHandle === targetHandle,
  );
}