import CustomHandle from "./CustomHandle.jsx";
import { useRotatedNode } from "../hooks/useRotatedNode.jsx";
import React from "react";

function LogicGateBase({
  id,
  data,
  isConnectable,
  IconComponent,
  handleConfigs,
  getHandleStyleOverrides,
}) {
  const rotation = data.rotation || 0;
  const { getHandlePosition, RotatedNodeWrapper } = useRotatedNode(
    id,
    rotation,
    80,
    70,
  );

  const getHandleStyle = (handle) => {
    if (getHandleStyleOverrides) {
      return getHandleStyleOverrides(handle, rotation);
    }

    // Default handle styles for two-input gates
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

  return (
    <RotatedNodeWrapper className="circuit-button">
      <IconComponent SVGClassName={"circuit-button-icon"} />

      {/* Handles */}
      {handleConfigs.map(({ id: handleId, type, position }) => (
        <CustomHandle
          key={handleId}
          id={handleId}
          type={type}
          position={getHandlePosition(position)}
          isConnectable={isConnectable}
          style={getHandleStyle(handleId)}
          connections={handleId.slice(0, 2) === "in" ? 1 : undefined}
        />
      ))}
    </RotatedNodeWrapper>
  );
}

export default LogicGateBase;
