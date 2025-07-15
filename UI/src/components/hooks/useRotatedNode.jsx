// hooks/useRotatedNode.js
import { useEffect } from "react";
import { Position, useReactFlow, useUpdateNodeInternals } from "@xyflow/react";

export const useRotatedNode = (id, rotation, originalWidth, originalHeight) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { setNodes } = useReactFlow();

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

  const getRotatedDimensions = (width, height, rotation) => {
    const radians = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    const newWidth = width * cos + height * sin;
    const newHeight = width * sin + height * cos;
    return { width: Math.floor(newWidth), height: Math.floor(newHeight) };
  };

  useEffect(() => {
    const { width, height } = getRotatedDimensions(
      originalWidth,
      originalHeight,
      rotation,
    );

    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              style: {
                ...node.style,
                width: `${width}px`,
                height: `${height}px`,
              },
            }
          : node,
      ),
    );

    updateNodeInternals(id);
  }, [
    rotation,
    id,
    updateNodeInternals,
    setNodes,
    originalWidth,
    originalHeight,
  ]);

  const { width: rotatedWidth, height: rotatedHeight } = getRotatedDimensions(
    originalWidth,
    originalHeight,
    rotation,
  );

  return {
    getHandlePosition,
    rotatedWidth,
    rotatedHeight,
    RotatedNodeWrapper: ({ children, className, style = {} }) => (
      <div
        style={{
          width: rotatedWidth,
          height: rotatedHeight,
        }}
      >
        <div
          className={className}
          style={{
            transform: `rotate(${rotation}deg)`,
            width: originalWidth,
            height: originalHeight,
            position: "absolute",
            ...style,
          }}
        >
          {children}
        </div>
      </div>
    ),
  };
};
