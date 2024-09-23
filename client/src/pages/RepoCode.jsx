import React, { useState, useEffect } from 'react';

const RepoCode = () => {
  const [leftWidth, setLeftWidth] = useState(window.innerWidth/4); // Initial width for the left panel
  const [middleWidth, setMiddleWidth] = useState(window.innerWidth/2); // Initial width for the middle panel
  const [rightWidth, setRightWidth] = useState(window.innerWidth/4); // Initial width for the right panel
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const handleMouseDownLeft = () => {
    setIsResizingLeft(true);
  };

  const handleMouseDownRight = () => {
    setIsResizingRight(true);
  };

  const handleMouseMove = (event) => {
    if (isResizingLeft) {
      const newWidth = event.clientX;
      if (newWidth > 100 && newWidth < window.innerWidth - rightWidth - 10) {
        setLeftWidth(newWidth);
        setMiddleWidth(window.innerWidth - newWidth - rightWidth - 10);
      }
    }

    if (isResizingRight) {
      const newWidth = window.innerWidth - event.clientX;
      if (newWidth > 100 && newWidth < window.innerWidth - leftWidth - 10) {
        setRightWidth(newWidth);
        setMiddleWidth(window.innerWidth - leftWidth - newWidth - 10);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  };

  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  return (
    <div className="resizable-layout flex h-[100vh]">
      <div className="file-explorer bg-[#03152b] border-r-2 border-solid border-[#ccc] overflow-auto" style={{ width: leftWidth }}>
        <h2>Files</h2>
        {/* Your file explorer content goes here */}
      </div>
      <div className="resizer cursor-ew-resize w-5 bg-transparent" onMouseDown={handleMouseDownLeft} />
      <div className="editor flex bg-[#312408] border-r-2 border-solid border-[#ccc] overflow-auto" style={{ width: middleWidth }}>
        <h2>Editor</h2>
        {/* Your editor content goes here */}
      </div>
      <div className="resizer cursor-ew-resize w-5 bg-transparent" onMouseDown={handleMouseDownRight} />
      <div className="terminal bg-[#03152b] overflow-auto" style={{ width: rightWidth }}>
        <h2>Terminal</h2>
        {/* Your terminal content goes here */}
      </div>
    </div>
  );
};

export default RepoCode;
