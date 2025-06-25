import React, { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

export default function EdgeContextMenu({
                                          id,
                                          name,
                                          top,
                                          left,
                                          right,
                                          bottom,
                                          ...props
                                        }) {
  const { setEdges } = useReactFlow();
  const changeEdgeType = useCallback((wireType) => {
    setEdges((edges) => edges.map(edge =>
      edge.id === id ? { ...edge, type: wireType } : edge
    ));
  }, [id, setEdges]);

  const deleteEdge = useCallback(() => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  }, [setEdges, id]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <div style={{ margin: "0.5em", textAlign: "center" }}>
        <div style={{ fontSize: "0.95rem", margin: "0.7rem 0 0.7rem 0" }}>
          Wire type: {name ? name : ""}
        </div>
      </div>
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={() => changeEdgeType('straight')}
      >
        Straight type
      </button>
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={() => changeEdgeType('step')}
      >
        Step type
      </button>
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={() => changeEdgeType('default')}
      >
        Bezier type
      </button>
      <button
        style={{ margin: "0.5rem" }}
        className={"contextMenuButton"}
        onClick={deleteEdge}
      >
        Delete
      </button>
    </div>
  );
}
