import { useEffect, useState } from "react";
import { Position } from "@xyflow/react";
import CustomHandle from "../../codeComponents/CustomHandle.jsx";
import { subscribeToOutput } from "../../codeComponents/outputStateManager.js";
import { useRotatedNode } from "../../hooks/useRotatedNode.jsx";

function OutputNodeLed({ id, data, isConnectable }) {
  const [isActive, setIsActive] = useState(false);
  const rotation = data.rotation || 0;
  const { getHandlePosition, RotatedNodeWrapper } = useRotatedNode(
    id,
    rotation,
    60,
    80,
  );

  const getHandleStyle = () => {
    switch (rotation) {
      case 90:
        return { top: 39.5, left: -1 };
      case 180:
        return { top: 38.5, left: -8 };
      case 270:
        return { top: 32, left: -1 };
      default:
        return { top: 40, left: -1 };
    }
  };

  useEffect(() => {
    const outputId = `out_${id}`;
    const unsubscribe = subscribeToOutput(outputId, (newVal) => {
      setIsActive(newVal === 1);
    });
    return () => unsubscribe();
  }, [id]);

  return (
    <RotatedNodeWrapper className="circuit-button">
      <p className={"input-text"}>LED</p>

      <div className={`led-wrapper`}>
        <Led
          isActive={isActive}
          SVGclassName={`led-icon ${isActive ? "active" : ""}`}
        />
      </div>

      <CustomHandle
        type="target"
        position={getHandlePosition(Position.Left)}
        id="input-1"
        style={getHandleStyle("input-1")}
        isConnectable={isConnectable}
        maxConnections={1}
      />
    </RotatedNodeWrapper>
  );
}

const Led = ({ isActive, SVGclassName }) => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" className={SVGclassName}>
      <defs>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1.5"
            floodColor="red"
            floodOpacity="0.8"
          />
        </filter>
      </defs>
      <rect
        x="2"
        y="2"
        width="21"
        height="21"
        rx="4"
        ry="4"
        stroke="black"
        strokeWidth="1"
        fill={isActive ? "red" : "none"}
        filter={isActive ? "url(#glow)" : "none"}
      />
    </svg>
  );
};

export default OutputNodeLed;
