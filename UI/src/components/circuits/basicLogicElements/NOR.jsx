import { useEffect } from "react";
import { Position, useUpdateNodeInternals } from "@xyflow/react";
import CustomHandle from "../../codeComponents/CustomHandle.jsx";
import { IconNOR } from "../../../../assets/circuits-icons.jsx";

function NorNode({ id, data, isConnectable }) {
  const rotation = data.rotation || 0;
  const updateNodeInternals = useUpdateNodeInternals();

  const getHandlePosition = (basePosition) => {
    const positions = [
      Position.Top,
      Position.Right,
      Position.Bottom,
      Position.Left,
    ];
    const currentIndex = positions.indexOf(basePosition);
    const newIndex = (currentIndex + Math.floor(rotation / 90)) % 4;
    return positions[newIndex];
  };

  const getHandleStyle = (handle) => {
    switch (rotation) {
      case 90:
        return handle === "input-1"
          ? { top: 24, left: -1 }
          : handle === "input-2"
            ? { top: 44, left: -1 }
            : { top: 26.5, left: 79 };
      case 180:
        return handle === "input-1"
          ? { top: 24, left: -8 }
          : handle === "input-2"
            ? { top: 44, left: -8 }
            : { top: 34, left: 79 };
      case 270:
        return handle === "input-1"
          ? { top: 17, left: -1 }
          : handle === "input-2"
            ? { top: 37, left: -1 }
            : { top: 34.5, left: 79 };
      default:
        return handle === "input-1"
          ? { top: 25, left: -1 }
          : handle === "input-2"
            ? { top: 45, left: -1 }
            : { top: 35, left: 72 };
    }
  };

  useEffect(() => {
    updateNodeInternals(id);
  }, [rotation, id, updateNodeInternals]);

  return (
    <div
      className="circuit-button"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <IconNOR SVGClassName={"circuit-button-icon"} />

      {/* Handles */}
      <CustomHandle
        type="target"
        position={getHandlePosition(Position.Left)}
        id="input-1"
        style={getHandleStyle("input-1")}
        isConnectable={isConnectable}
        maxConnections={1}
      />
      <CustomHandle
        type="target"
        position={getHandlePosition(Position.Left)}
        id="input-2"
        style={getHandleStyle("input-2")}
        isConnectable={isConnectable}
        maxConnections={1}
      />
      <CustomHandle
        type="source"
        position={getHandlePosition(Position.Right)}
        id="output-1"
        style={getHandleStyle("output-1")}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default NorNode;
