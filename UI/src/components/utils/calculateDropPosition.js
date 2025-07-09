export function calculateDropPosition(event, screenToFlowPosition, nodeSize) {
  const rawPos = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });

  return {
    x: rawPos.x - nodeSize.width  / 2,
    y: rawPos.y - nodeSize.height / 2,
  };
}