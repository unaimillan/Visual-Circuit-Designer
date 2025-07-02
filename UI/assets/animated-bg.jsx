import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function VantaFogBackground() {
  const ref = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (!effectRef.current && window.VANTA?.FOG) {
      effectRef.current = window.VANTA.FOG({
        el: ref.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        baseColor: 0x0,
        highlightColor: 0x6B00CC,
        midtoneColor: 0x0,
        lowlightColor: 0x0,
        blurFactor: 0.9,
        speed: 1.0,
        zoom: 0.4
      });
    }

    return () => {
      if (effectRef.current) effectRef.current.destroy();
    };
  }, []);

  return <div ref={ref}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
              }}
  />;
}

