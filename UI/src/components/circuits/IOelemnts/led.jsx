import { Position, useUpdateNodeInternals } from "@xyflow/react";
import { useEffect, useState } from "react";
import { subscribeToOutput } from "../../codeComponents/outputStateManager.js";
import CustomHandle from "../../codeComponents/CustomHandle.jsx";

function OutputNodeLed({ id, data, isConnectable }) {
  const [isActive, setIsActive] = useState(false);
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

  const getHandleStyle = () => {
    switch (rotation) {
      case 90:
        return { top: 0, left: 28 };
      case 180:
        return { top: 40, left: 52 };
      case 270:
        return { top: 72.5, left: 28 };
      default:
        return { top: 40, left: -1 };
    }
  };

  useEffect(() => {
    updateNodeInternals(id);
  }, [rotation, id, updateNodeInternals]);

  useEffect(() => {
    const outputId = `out_${id}`; // Пример: "out_output1"
    const unsubscribe = subscribeToOutput(outputId, (newVal) => {
      setIsActive(newVal === 1);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <div className="circuit-button" style={{ width: "60px", height: "80px" }}>
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
        style={getHandleStyle()}
        isConnectable={isConnectable}
      />
    </div>
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
