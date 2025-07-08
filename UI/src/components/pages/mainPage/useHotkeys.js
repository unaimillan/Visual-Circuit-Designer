import { useEffect } from 'react';
import { hotkeyHandler } from '../../utils/hotkeyHandler.js';

export function useHotkeys(deps, dependencies) {
  useEffect(() => {
    const handleKeyDown = (e) => hotkeyHandler(e, deps);

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, dependencies);
}