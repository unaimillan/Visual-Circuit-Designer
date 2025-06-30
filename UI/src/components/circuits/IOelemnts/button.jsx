// noinspection DuplicatedCode
import { useState, useRef, useEffect } from "react";
import { Position, useUpdateNodeInternals } from "@xyflow/react";
import CustomHandle from "../../codeComponents/CustomHandle.jsx";
import { useSimulateState } from "../../pages/mainPage.jsx";

function InputNodeButton({ id, data, isConnectable }) {
  const { simulateState, updateInputState } = useSimulateState();
  const [inputState, setInputState] = useState(false);
  const cooldownRef = useRef(false);
  const delay = 500;
  const rotation = data.rotation || 0;
  const updateNodeInternals = useUpdateNodeInternals();

  const getHandlePosition = (basePosition) => {
    const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];
    const currentIndex = positions.indexOf(basePosition);
    const newIndex = (currentIndex + Math.floor(rotation / 90)) % 4;
    return positions[newIndex];
  };

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
  }

  useEffect(() => {
    updateNodeInternals(id);
  }, [rotation, id, updateNodeInternals]);

  useEffect(() => {
    setInputState(data.value || false);
  }, [data.value]);

  const handleChange = (newValue) => {
    setInputState(newValue);

    if (simulateState === "running" && updateInputState)
      updateInputState(id, newValue);

    data.value = newValue;
  };

  const handlePressDown = (e) => {
    e.stopPropagation();

    if (cooldownRef.current || inputState) return;

    handleChange(true);
  };

  const handlePressUp = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!inputState) return;

    cooldownRef.current = true;
    setTimeout(() => {
      handleChange(false);
      cooldownRef.current = false;
    }, delay);
  };

  return (
    <div
      className="circuit-button input"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <p className={"input-text"}>Button</p>

      <SvgButton
        pressed={inputState}
        onPressDown={handlePressDown}
        onPressUp={handlePressUp}
        disabled={simulateState === "idle"}
      />

      <CustomHandle
        type="source"
        position={getHandlePosition(Position.Right)}
        id="output-1"
        style={getHandleStyle('output-1')}
        isConnectable={isConnectable}
      />
    </div>
  );
}

const SvgButton = ({ pressed, onPressDown, onPressUp, disabled }) => {
  return (
    <div
      className={`svg-button-wrapper ${disabled ? "disabled" : ""} ${pressed ? "pressed" : ""}`}
      onPointerDownCapture={onPressDown}
      onPointerUpCapture={onPressUp}
    >
      <div className={`svg-button-inner ${pressed ? "pressed" : ""}`} />
    </div>
  );
};

export default InputNodeButton;
