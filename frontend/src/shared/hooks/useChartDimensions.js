import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to measure a container's dimensions using ResizeObserver.
 * This completely bypasses Recharts' ResponsiveContainer to avoid measurement 
 * bugs during CSS animations.
 */
export const useChartDimensions = () => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observeTarget = ref.current;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Only set dimensions if they are greater than 0
        // This explicitly prevents the Recharts "-1" width/height error
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    resizeObserver.observe(observeTarget);

    return () => {
      if (observeTarget) {
        resizeObserver.unobserve(observeTarget);
      }
    };
  }, []);

  return [ref, dimensions];
};
