import { MIN_DISTANCE } from "../constants/numbers";

export function getClosestEdge({
                                 draggedNode,
                                 nodeLookup,
                                 getInternalNode,
                                 edges,
                               }) {
  const internalNode = getInternalNode(draggedNode.id);
  if (!internalNode) return null;

  const draggedHandles = internalNode.internals.handleBounds;
  if (!draggedHandles) return null;

  const draggedPos = internalNode.internals.positionAbsolute;
  let closestEdge = null;
  let minDistance = MIN_DISTANCE;

  for (const node of nodeLookup.values()) {
    if (node.id === draggedNode.id) continue;
    const nodeHandles = node.internals.handleBounds;
    if (!nodeHandles) continue;
    const nodePos = node.internals.positionAbsolute;

    // source -> target
    if (draggedHandles.source) {
      for (const srcHandle of draggedHandles.source) {
        const srcHandlePos = {
          x: draggedPos.x + srcHandle.x + srcHandle.width / 2,
          y: draggedPos.y + srcHandle.y + srcHandle.height / 2,
        };

        if (nodeHandles.target) {
          for (const tgtHandle of nodeHandles.target) {
            const alreadyUsed = edges.some(
              (e) => e.target === node.id && e.targetHandle === tgtHandle.id
            );
            if (alreadyUsed) continue;

            const tgtHandlePos = {
              x: nodePos.x + tgtHandle.x + tgtHandle.width / 2,
              y: nodePos.y + tgtHandle.y + tgtHandle.height / 2,
            };

            const dx = srcHandlePos.x - tgtHandlePos.x;
            const dy = srcHandlePos.y - tgtHandlePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
              minDistance = distance;
              closestEdge = {
                id: `temp_${internalNode.id}_${srcHandle.id}_to_${node.id}_${tgtHandle.id}`,
                source: internalNode.id,
                sourceHandle: srcHandle.id,
                target: node.id,
                targetHandle: tgtHandle.id,
                className: "temp",
              };
            }
          }
        }
      }
    }

    // target -> source
    if (draggedHandles.target) {
      for (const tgtHandle of draggedHandles.target) {
        const tgtHandlePos = {
          x: draggedPos.x + tgtHandle.x + tgtHandle.width / 2,
          y: draggedPos.y + tgtHandle.y + tgtHandle.height / 2,
        };

        if (nodeHandles.source) {
          for (const srcHandle of nodeHandles.source) {
            const alreadyUsed = edges.some(
              (e) =>
                e.target === internalNode.id &&
                e.targetHandle === tgtHandle.id
            );
            if (alreadyUsed) continue;

            const srcHandlePos = {
              x: nodePos.x + srcHandle.x + srcHandle.width / 2,
              y: nodePos.y + srcHandle.y + srcHandle.height / 2,
            };

            const dx = tgtHandlePos.x - srcHandlePos.x;
            const dy = tgtHandlePos.y - srcHandlePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
              minDistance = distance;
              closestEdge = {
                id: `temp_${node.id}_${srcHandle.id}_to_${internalNode.id}_${tgtHandle.id}`,
                source: node.id,
                sourceHandle: srcHandle.id,
                target: internalNode.id,
                targetHandle: tgtHandle.id,
                className: "temp",
              };
            }
          }
        }
      }
    }
  }
  return closestEdge;
}
