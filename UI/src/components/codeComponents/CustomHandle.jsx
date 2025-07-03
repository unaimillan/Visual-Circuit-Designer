import React from "react";
import { Handle, useEdges, useNodeId } from "@xyflow/react";

const CustomHandle = (props) => {
  const nodeId = useNodeId();
  const edges = useEdges();
  const connections = edges.filter(
    (edge) =>
      (edge.source === nodeId && edge.sourceHandle === props.id) || // Handle as source
      (edge.target === nodeId && edge.targetHandle === props.id), // Handle as target
  ).length;

  return (
    <Handle
      className={"customHandle"}
      {...props}
      isConnectable={
        connections < props.connections ||
        props.connections === undefined
      }
    />
  );
};

export default CustomHandle;
