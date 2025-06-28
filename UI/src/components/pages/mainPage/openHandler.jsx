import React, { useRef } from 'react';

function CircuitEditor({ loadCircuit }) {
  const fileInputRef = useRef(null);
  console.log('111')
  return (
    <div>
      <button onClick={() => fileInputRef.current?.click()}>
        Загрузить схему
      </button>




      <input
        type="file"
        accept=".json"
        onChange={loadCircuit}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </div>
  );
}
