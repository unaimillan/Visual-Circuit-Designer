import { Position } from "@xyflow/react";

import CustomHandle from "../../codeComponents/CustomHandle.jsx";
import { useSimulateState } from "../../pages/mainPage.jsx";

import { useEffect, useState } from "react";

function InputNodeSwitch({ id, isConnectable, data }) {
  const { simulateState, updateInputState } = useSimulateState();
  const [inputState, setInputState] = useState(false);

  useEffect(() => {
    setInputState(data.value || false);
  }, [data.value]);

  const handleChange = (newValue) => {
    setInputState(newValue);

    // Отправляем изменение на сервер
    if (simulateState === "running" && updateInputState) {
      updateInputState(id, newValue);
    }

    // Обновляем данные узла (опционально)
    data.value = newValue;
  };

  return (
    <div className="circuit-button input">
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

      {/* Handles */}
      <CustomHandle
        type="source"
        position={Position.Right}
        id="output-1"
        style={{ top: 40, left: 52.2 }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

// Вместо @radix-ui/react-switch
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
        fill={checked ? "var(--select-color)" : "var(--switch-bg-color)"}
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
