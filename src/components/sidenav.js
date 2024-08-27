import Accordion from 'react-bootstrap/Accordion';
import { useNavigate } from 'react-router-dom';
import '../css/componunt/sidenav.css';

function Sidenav() {
  let navigate = useNavigate();

  return (
    <Accordion alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>통합검색</Accordion.Header>
        <Accordion.Body>
          <span onClick={() => {navigate('/');}}>통합검색1</span>
          <hr />
          <span>통합검색2</span>
          <hr />
          <span>통합검색3</span>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>게시판</Accordion.Header>
        <Accordion.Body>
          <span onClick={() => {navigate('/board/communityBoard');}}>커뮤니티 게시판</span>
          <hr />
          <span onClick={() => {navigate('/board/noticeBoard');}}>공지사항 게시판</span>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>메타데이터 관리</Accordion.Header>
        <Accordion.Body>
          <span>단어</span>
          <hr />
          <span>도메인</span>
          <hr />
          <span>용어</span>
          <hr />
          <span>데이터표준화 신청결과현황</span>
          <hr />
          <span>테이블 신청</span>
          <hr />
          <span>테이블 신청결과현황</span>
          <hr />
          <span>논리테이블 조회</span>
          <hr />
          <span>물리테이블 조회</span>
          <hr />
          <span>논리 물리 정합성체크</span>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>데이터품질 관리</Accordion.Header>
        <Accordion.Body></Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>영향도 분석</Accordion.Header>
        <Accordion.Body></Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="5">
        <Accordion.Header>비즈메타 관리</Accordion.Header>
        <Accordion.Body></Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="6">
        <Accordion.Header>관리자 설정</Accordion.Header>
        <Accordion.Body>
          <span onClick={() => {navigate('/admin/roleManagement');}}>역할관리</span>
          <hr />
          <span onClick={() => {navigate('/admin/userManagement');}}>사용자관리</span>
          <hr />
          <span onClick={() => {navigate('/admin/menuManagement');}}>메뉴관리</span>
          <hr />
          <span>권한관리</span>
          <hr />
          <span>코드관리</span>
          <hr />
          <span>업무관리</span>
          <hr />
          <span>배치관리</span>
          <hr />
          <span>서버관리</span>
          <hr />
          <span>방문자관리</span>
          <hr />
          
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="7">
        <Accordion.Header>제작자 유지보수</Accordion.Header>
        <Accordion.Body>
          <span onClick={() => {navigate('/maintenance/resetdata');}}>데이터 리셋</span>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Sidenav;
