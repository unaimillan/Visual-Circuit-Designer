import { Position } from '@xyflow/react';

import CustomHandle from '../../codeComponents/CustomHandle.jsx';
import {IconInput} from '../../../../assets/circuits-icons.jsx';

function inputNode({ isConnectable }) {
  return (
    <div className='circuit-button'>
      <IconInput SVGClassName={'circuit-button-icon'}/>

      {/* Handles */}
      <CustomHandle
        type="source"
        position={Position.Right}
        id="output-1"
        style={{ top: 34, left: 72 }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default inputNode;