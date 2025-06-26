import { Position } from '@xyflow/react';

import CustomHandle from '../../codeComponents/CustomHandle.jsx';
import {useEffect, useState, useRef} from "react";



const SpamProtectedButton = () => {


};


function InputNodeSwitch({ id, isConnectable, data}) {
  const { simulateState, updateInputState } = useSimulateState();
  const [inputState, setInputState] = useState(false);

  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef(null);
  const delay = 300; // миллисекунд между нажатием и отпусканием

  useEffect(() => {
    setInputState(data.value || false);
  }, [data.value]);

  // Обработчик изменения состояния
  const handleChange = (newValue) => {
    setInputState(newValue);

    // Отправляем изменение на сервер
    if (simulateState === "running" && updateInputState) {
      updateInputState(id, newValue);
    }

    // Обновляем данные узла (опционально)
    data.value = newValue;
  };


  const handlePress = () => {
    if (pressed || timeoutRef.current) return; // блокируем повторное нажатие

    setPressed(true);

    // Автоматическое отпускание через задержку
    timeoutRef.current = setTimeout(() => {
      setPressed(false);
      timeoutRef.current = null;
    }, delay);
  };

  return (

  );

  return (
    <div className='circuit-button input'>
      <div className="input-icon-wrapper">
        <IconInput SVGClassName="circuit-button-icon" />
      </div>

      {simulateState  !== "idle" &&
        <div className="switch-wrapper">
          <button
            onClick={handlePress}
            disabled={pressed} // не обязательно, но можно
            style={{
              backgroundColor: pressed ? '#aaa' : '#007bff',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: pressed ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {pressed ? 'Нажато...' : 'Жми меня~'}
          </button>
        </div>
      }

      {/* Handles */}
      <CustomHandle
        type="source"
        position={Position.Right}
        id="output-1"
        style={{ top: 25, left: 92}}
        isConnectable={isConnectable}
      />
    </div>
  );
}




import {useSimulateState} from "../../../pages/mainPage.jsx";


export default SpamProtectedButton;



