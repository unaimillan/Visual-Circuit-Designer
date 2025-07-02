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
        highlightColor: 0x4a6395,
        midtoneColor: 0x293856,
        lowlightColor: 0x0,
        blurFactor: 1.0,
        speed: 1.0,
        zoom: 0.3,
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

