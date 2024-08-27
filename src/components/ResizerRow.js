const Resizer = ({ containerRef, topDivRef, bottomDivRef }) => {
  const handleMouseMove = (event) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const newHeight = event.clientY - containerRect.top;
    
    // 위쪽 영역의 높이를 조정하면서 최소 높이를 보장
    if (newHeight > 100 && newHeight < containerRect.height - 100) {
      topDivRef.current.style.height = `${newHeight}px`;
      bottomDivRef.current.style.height = `${containerRect.height - newHeight}px`;
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return <div className="resizer-row" onMouseDown={handleMouseDown}></div>;
};

export default Resizer;