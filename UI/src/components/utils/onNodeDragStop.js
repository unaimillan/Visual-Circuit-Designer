import { getClosestEdge } from "./getClosestEdge.js";

export function onNodeDragStop({
                                 nodes,
                                 setEdges,
                                 getInternalNode,
                                 store,
                                 addEdge,
                                 recordHistory,
                               }) {
  return (_, draggedNode) => {
    const selectedNodes = nodes.filter(
      (n) => n.selected || n.id === draggedNode.id,
    );

    setEdges((edges) => {
      let newEdges = edges.filter((e) => e.className !== "temp");
      for (const node of selectedNodes) {
        const closeEdge = getClosestEdge({
          draggedNode: node,
          nodeLookup: store.getState().nodeLookup,
          getInternalNode,
          edges: newEdges,
        });

        if (closeEdge) {
          newEdges = addEdge(
            {
              type: "straight",
              source: closeEdge.source,
              sourceHandle: closeEdge.sourceHandle,
              target: closeEdge.target,
              targetHandle: closeEdge.targetHandle,
            },
            newEdges,
          );
        }
      }

      setTimeout(() => onComplete && onComplete(), 0);

      return newEdges;
    });
  };
}