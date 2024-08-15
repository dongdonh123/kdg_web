import './App.css';
import Sidenav from './components/sidenav';
import { Routes, Route } from 'react-router-dom';
import CommunityBoard from './route/communityBoard';
import RoleManagement from './route/admin/RoleManagement';
import MenuManagement from './route/admin/MenuManagement';
import Resetdata from './route/Resetdata';
import React, { useState, useRef, useCallback } from 'react';

function App() {

  const [leftWidth, setLeftWidth] = useState(300);
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
  };

  const resize = useCallback((e) => {
      if (isResizing.current) {
          if (animationFrameId.current) {
              cancelAnimationFrame(animationFrameId.current);
          }
          animationFrameId.current = requestAnimationFrame(() => {
              const newLeftWidth = e.clientX - e.target.parentNode.offsetLeft;
              setLeftWidth(newLeftWidth);
          });
      }
  }, []);

  return (
    <div className="App">
      <div className="header"></div>
      <div className="main-ctn">
        <div className="side-nav" style={{ width: `${leftWidth}px` }}><Sidenav></Sidenav></div>
        <div id="resizer" onMouseDown={startResizing}></div>
        <div className="content-ctn">
          <Routes>
            <Route path="/" element={<div>메인화면</div>}></Route>

            <Route path="/board">
              <Route path="communityBoard" element={<CommunityBoard />}></Route>
              <Route path="noticeBoard" element={<div>공지사항보드</div>}></Route>
            </Route>

            <Route path="/admin">
              <Route path="roleManagement" element={<RoleManagement/>}></Route>
              <Route path="menuManagement" element={<MenuManagement/>}></Route>
            </Route>

            <Route path="/maintenance">
              <Route path="resetdata" element={<Resetdata/>}></Route>
            </Route>

            <Route path="*" element={<div>404 없는 페이지입니다!</div>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
