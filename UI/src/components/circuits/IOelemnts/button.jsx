// noinspection DuplicatedCode

import { useState, useRef, useEffect } from "react";
import { useSimulateState } from "../../../pages/mainPage.jsx";
import CustomHandle from "../../codeComponents/CustomHandle.jsx";
import { Position } from "@xyflow/react";

function InputNodeButton({ id, isConnectable, data }) {
  const { simulateState, updateInputState } = useSimulateState();
  const [inputState, setInputState] = useState(false);
  const cooldownRef = useRef(false);
  const delay = 500;

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
    <div className="circuit-button input">
      <p className={"input-text"}>Button</p>

      <div
        className={`button-wrapper ${simulateState === `idle` ? "deactivated" : ""}`}
        onPointerDownCapture={handlePressDown}
        onPointerUpCapture={handlePressUp}
      >
        <button
          draggable={false}
          className={`button-icon ${inputState ? "clicked" : ""}`}
        ></button>
      </div>

      <CustomHandle
        type="source"
        position={Position.Right}
        id="output-1"
        style={{ top: 40, left: 52.2, zIndex: "1000000" }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default InputNodeButton;
