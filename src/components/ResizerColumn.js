import React, { useRef, useCallback } from 'react';
// import './Resizer.css'; // 스타일을 따로 정의할 수 있습니다

const ResizerColumn = ({ onResize, onResizeEnd }) => {
  const isResizing = useRef(false);
  const animationFrameId = useRef(null);

  const startResizing = (e) => {
    isResizing.current = true;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResizing);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (onResizeEnd) {
      onResizeEnd();
    }
  };

  const resize = useCallback((e) => {
    if (isResizing.current) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(() => {
        if (onResize) {
          onResize(e);
        }
      });
    }
  }, [onResize]);

  return (
    <div
      className="resizer-column"
      onMouseDown={startResizing}
    ></div>
  );
};

export default ResizerColumn;