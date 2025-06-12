import {Handle, Position} from '@xyflow/react';
import XorGate from '../../assets/circuitsMenu/XOR.svg';

import CustomHandle from './CustomHandle';

function XorNode({ isConnectable }) {
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
      <img src={XorGate} alt="XOR Gate" style={{ objectFit: 'cover', maxWidth: '100%', height: '110%' }}/>

      {/* Handles */}
      <CustomHandle
        type="target"
        position={Position.Left}
        id="input-1"
        style={{ top: 24, left: -1 }}
        isConnectable={isConnectable}
        maxConnections={1}
      />
      <CustomHandle
        type="target"
        position={Position.Left}
        id="input-2"
        style={{ top: 44, left: -1 }}
        isConnectable={isConnectable}
        maxConnections={1}
      />
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

export default XorNode;