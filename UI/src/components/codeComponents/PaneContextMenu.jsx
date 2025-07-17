import React, { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

export default function PaneContextMenu({
                                          copyElements,
                                          pasteElements,
                                          cutElements,
                                          selectedElements,
                                          clipboard,
                                          onClose,
                                          top,
                                          left,
                                          right,
                                          bottom,
                                          ...props
                                        }) {
  const { setNodes, setEdges } = useReactFlow();

  // const rotateSelectedNodes = useCallback(
  //   (angle) => {
  //     console.log("selectedElements", selectedElements);
  //     if (!selectedElements?.nodes?.length) return;
  //     const selectedNodeIds = new Set(selectedElements.nodes.map((n) => n.id));
  //
  //     setNodes((nodes) =>
  //       nodes.map((node) => {
  //         if (selectedNodeIds.has(node.id)) {
  //           const currentRotation = node.data?.rotation || 0;
  //           const newRotation = (currentRotation + angle + 360) % 360;
  //           return {
  //             ...node,
  //             data: {
  //               ...node.data,
  //               rotation: newRotation,
  //             },
  //           };
  //         }
  //         return node;
  //       })
  //     );
  //   },
  //   [selectedElements, setNodes],
  // );

  const deleteSelectedElements = useCallback(() => {
    const selectedNodeIds = new Set(selectedElements.nodes.map(n => n.id));
    const selectedEdgeIds = new Set(selectedElements.edges.map(e => e.id));

    setNodes(nodes =>
      nodes.filter(node => !selectedNodeIds.has(node.id))
    );

    setEdges(edges =>
      edges.filter(edge =>
        !selectedEdgeIds.has(edge.id) &&
        !selectedNodeIds.has(edge.source) &&
        !selectedNodeIds.has(edge.target)
      )
    );
  }, [selectedElements, setNodes, setEdges]);


  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      onClick={onClose}
      {...props}
    >
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={copyElements}
        disabled={!selectedElements?.nodes?.length}
      >
        Copy
      </button>
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={pasteElements}
        disabled={!clipboard?.nodes?.length}
      >
        Paste here
      </button>
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={cutElements}
        disabled={!selectedElements?.nodes?.length}
      >
        Cut
      </button>
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={deleteSelectedElements}
      >
        Delete
      </button>
    </div>
  );
}
