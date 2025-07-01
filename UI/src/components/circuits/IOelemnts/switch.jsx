import { useEffect, useState } from "react";
import { Position } from "@xyflow/react";
import CustomHandle from "../../codeComponents/CustomHandle.jsx";
import { useSimulateState } from "../../pages/mainPage.jsx";
import { useRotatedNode } from "../../hooks/useRotatedNode.jsx";

function InputNodeSwitch({ id, data, isConnectable }) {
  const { simulateState, updateInputState } = useSimulateState();
  const [inputState, setInputState] = useState(false);
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
        return { top: 32, left: 59 };
      case 180:
        return { top: 38.5, left: 59 };
      case 270:
        return { top: 39.5, left: 59 };
      default:
        return { top: 40, left: 52 };
    }
  };

  useEffect(() => {
    setInputState(data.value || false);
  }, [data.value]);

  const handleChange = (newValue) => {
    setInputState(newValue);
    if (simulateState === "running" && updateInputState) {
      updateInputState(id, newValue);
    }
    data.value = newValue;
  };

  return (
    <RotatedNodeWrapper className="circuit-button">
      <p className={"input-text"}>Switch</p>

      <div
        className={`switch-wrapper ${simulateState === "idle" ? "deactivated" : ""}`}
      >
        <SvgSwitch
          checked={inputState}
          onChange={handleChange}
          SWGclassName="circuit-switch-input"
        />
      </div>

      <CustomHandle
        type="source"
        position={getHandlePosition(Position.Right)}
        id="output-1"
        style={getHandleStyle("output-1")}
        isConnectable={isConnectable}
      />
    </RotatedNodeWrapper>
  );
}

const SvgSwitch = ({ checked, onChange, SWGclassName }) => {
  return (
    <svg
      className={SWGclassName}
      width="42"
      height="25"
      viewBox="0 0 42 25"
      style={{ overflow: "visible" }}
    >
      <rect
        x="0"
        y="0"
        width="42"
        height="25"
        rx="12.5"
        fill={checked ? "var(--select-1)" : "var(--switch-bg-color)"}
        onClick={() => onChange(!checked)}
        style={{ cursor: "pointer", transition: "fill 0.1s ease" }}
      />
      <circle
        cx="12.5"
        cy="12.5"
        r="10.5"
        fill="white"
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        style={{
          cursor: "pointer",
          transition: "transform 0.1s ease",
          transform: checked ? `translateX(17px)` : "translateX(0px)",
        }}
      />
    </svg>
  );
};

export default InputNodeSwitch;
