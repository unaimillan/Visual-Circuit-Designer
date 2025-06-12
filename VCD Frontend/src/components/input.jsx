import { Handle, Position } from '@xyflow/react';
import InputGate from '../../assets/circuitsMenu/input.svg';

function inputNode({ isConnectable }) {
  return (
    <div
      style={{
        width: 80,
        height: 70,
        position: 'relative',
        border: '1px solid #555',
        borderRadius: '4px',
        background: '#fff',
        display: 'flex',
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img src={InputGate} alt="input Gate" style={{ objectFit: 'cover', maxWidth: '100%', height: '110%' }}/>

      {/* Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="output-1"
        style={{ top: 34, left: 71 }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default inputNode;