import "./App.css";
import React, { useState, useRef, useCallback } from "react";
import Sidenav from "./components/sidenav";
import Resizer from "./components/ResizerColumn";
import { Routes, Route, Navigate } from "react-router-dom";
import CommunityBoard from "./route/board/communityBoard";
import RoleManagement from "./route/admin/RoleManagement";
import UserManagement from "./route/admin/UserManagement";
import MenuManagement from "./route/admin/MenuManagement";
import Resetdata from "./route/maintenance/Resetdata";
import Login from "./route/Login";
import MainPage from "./route/MainPage";
import Header from "./components/Header";
import { isAuthenticated } from "./components/Auth"; // JWT 인증 함수 불러오기

function App() {
  const [leftWidth, setLeftWidth] = useState(300);
  const handleResize = (e) => {
    const newLeftWidth = e.clientX - e.target.parentNode.offsetLeft;
    setLeftWidth(newLeftWidth);
  };

  // 로그인 여부를 확인하여 로그인 페이지를 제어하는 상태 변수
  const isLoggedIn = isAuthenticated();
  console.log("isLoggedIn : " + isLoggedIn);

  return (
    <div className="App">
      {/* 로그인 상태가 아니라면 /login 경로로 리다이렉트 */}
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // 로그인 상태일 때 메인 페이지 구성 요소 보여주기
        <>
          <div className="header">
            <Header></Header>
          </div>
          <div className="main-ctn">
            <div className="side-nav" style={{ width: `${leftWidth}px` }}>
              <Sidenav></Sidenav>
            </div>
            <Resizer onResize={handleResize} />
            <div className="content-ctn">
              <Routes>
                {/* 토큰이 있으면 메인페이지 없는 경우 로그인 페이지로 이동 */}
                <Route
                  path="/"
                  element={
                    isAuthenticated() ? (
                      <div>메인페이지</div>
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />

                <Route path="/board">
                  <Route
                    path="communityBoard"
                    element={<CommunityBoard />}
                  ></Route>
                  <Route
                    path="noticeBoard"
                    element={<div>공지사항보드</div>}
                  ></Route>
                </Route>

                <Route path="/admin">
                  <Route
                    path="roleManagement"
                    element={<RoleManagement />}
                  ></Route>
                  <Route
                    path="userManagement"
                    element={<UserManagement />}
                  ></Route>
                  <Route
                    path="menuManagement"
                    element={<MenuManagement />}
                  ></Route>
                </Route>

                <Route path="/maintenance">
                  <Route path="resetdata" element={<Resetdata />}></Route>
                </Route>

                <Route
                  path="/mainPage"
                  element={<div>메인페이지!</div>}
                ></Route>

                <Route
                  path="*"
                  element={<div>404 없는 페이지입니다!</div>}
                ></Route>
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
