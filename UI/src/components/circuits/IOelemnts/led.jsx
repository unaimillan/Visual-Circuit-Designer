import { Position } from '@xyflow/react';
import { useEffect, useState } from 'react';
import { subscribeToOutput } from '../../codeComponents/outputStateManager.js';
import CustomHandle from '../../codeComponents/CustomHandle.jsx';

function OutputNodeLed({ isConnectable, id }) {
  const [isActive, setIsActive] = useState(false);

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
    <div className='circuit-button input'>
      <p className={"input-text"}>LED</p>
      <div className={`led-wrapper`}>
        <Led isActive={isActive} SVGclassName={`led-icon ${isActive ? 'active' : ''}`} />
      </div>

      <CustomHandle
        type="target"
        position={Position.Left}
        id="input-1"
        style={{ top: 40, left: 0}}
        isConnectable={isConnectable}
        maxConnections={1}
      />
    </div>
  );
}



const Led = ({ isActive, SVGclassName}) => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" className={SVGclassName}>
      <defs>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="red" floodOpacity="0.8" />
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
        fill={isActive ? 'red' : 'none'}
        filter={isActive ? 'url(#glow)' : 'none'}
      />
    </svg>
  );
}

export default OutputNodeLed;