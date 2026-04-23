import { useState, useCallback, useEffect } from 'react';

/**
 * A robust custom hook to measure a container's dimensions using ResizeObserver.
 * Uses a callback ref to ensure the observer is correctly attached even if 
 * the component mounts asynchronously or conditionally.
 */
export const useChartDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [node, setNode] = useState(null);

  // Callback ref that React will call whenever the DOM element is mounted or unmounted
  const ref = useCallback(newNode => {
    if (newNode !== null) {
      setNode(newNode);
    }
  }, []);

  useEffect(() => {
    if (!node) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Update dimensions only if they are valid
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, [node]);

  return [ref, dimensions];
};
