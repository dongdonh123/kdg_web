import './App.css';
import Sidenav from './components/sidenav';
import { Routes, Route, Link } from 'react-router-dom';
import CommunityBoard from './route/communityBoard';


function App() {
  return (
    <div className="App">
      <div className="header"></div>
      <div className="main-ctn">
        <div className="side-nav">
          <Sidenav></Sidenav>
        </div>
        <div className="content-ctn">
          <Routes>
            <Route path="/" element={<div>메인화면</div>}></Route>

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

            <Route path="*" element={<div>404 없는 페이지입니다!</div>}></Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
