import React, { useRef, useState } from 'react';

function Resizer({ containerRef, topDivRef, bottomDivRef }) {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
    document.body.style.cursor = 'row-resize';
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const topHeight = e.clientY - containerRect.top;
    const bottomHeight = containerRect.bottom - e.clientY;

    topDivRef.current.style.height = `${topHeight}px`;
    bottomDivRef.current.style.height = `${bottomHeight}px`;
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  };

  return (
    <div
      className="resizer-row"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></div>
  );
}

export default Resizer;