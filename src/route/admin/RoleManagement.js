import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import '../../css/content-ctn2.css';

function RoleManagement() {


  // 리사이저 설정 시작

  const containerRef = useRef(null);
  const topDivRef = useRef(null);
  const bottomDivRef = useRef(null);
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
  // 리사이저 설정 끝

  const [roleList, setRoleList] = useState([]);
  const [otherInformation, setOtherInformation] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [role_name, setRole_name] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [role_id, setRole_id] = useState('');
  const [RoleDetail, setRoleDetail] = useState({        //오른쪽 메뉴정보 데이터
    role_id:'-',
    role_code:'-',
    role_name:'-',
    meta_use_yn:'-',
    create_dt:'-',
    create_user:'-',
    modify_dt:'-',
    modify_user:'-'                    
  }); 

  // 메인테이블 선택시 배경색 바꾸고 id 선택하기
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (index, role_id) => {
    setRole_id(role_id)
    setSelectedRow(index);
  };

  //메뉴id가 변경될때마다 오른쪽 상세정보 데이터 가져오기
  useEffect(() => {
    fetchRoleDetail();
  }, [role_id]);



  //메인 리스트 가져오기
  const fetchRoleList = async (page_no, page_cnt, role_name) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/role?page_no=${page_no}&page_cnt=${page_cnt}&role_name=${role_name}`);
      setRoleList(response.data.roleList);
      setOtherInformation(response.data.otherInformation);
      setIsFirstLoad(false);
    } catch (error) {
      console.error('Error fetching role list:', error);
    }
  };

  //하단 상세정보 api로 가져오는 부분 
  const fetchRoleDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/role/${role_id}`);
      setRoleDetail(response.data.roleDetail);

    } catch (error) {
      console.error('Error fetching role list:', error);
    }
  };

  // 처음만 실행
  useEffect(() => {
    if (isFirstLoad) {
      return;
    }
    fetchRoleList(currentPage, itemsPerPage);
  }, [currentPage,itemsPerPage]); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 호출

  const totalPages = otherInformation.max_page_no || 1;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    fetchRoleList(currentPage, itemsPerPage, role_name);
  };

  const pagelist = () => {
    let pages = [];
    let start = Math.max(1, (Math.floor((currentPage - 1) / 10) * 10) + 1); // 시작 페이지
    let end = Math.min(start + 9, totalPages); // 끝 페이지는 최대 totalPages까지
    for (let i = start; i <= end; i++) {
      pages.push(
        <Button key={i} onClick={() => handlePageChange(i)} disabled={i === currentPage}>
          {i}
        </Button>
      );
    }
    return pages;
  };



  return (
    <div>
      <div className="content_container-ctn2" ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <div className="메뉴명-ctn2"><div>역할관리</div></div>
        <div className="버튼-ctn2"><Button>신규</Button><Button>수정</Button><Button>삭제</Button></div>
        <div className="검색조건-ctn2" id="검색조건">
          <div id="left">역할명 : <input type="text" value={role_name} placeholder="역할명 검색" onChange={(e) => setRole_name(e.target.value)}/></div>
          <div id="right"><Button onClick={handleSearch}>검색</Button></div>
        </div>
        <div className="메인그리드-ctn2" id="메인그리드" >
          <table className ="MainTable">
            <thead className="TableHeader">
              <tr>
                <th className="number-column">번호</th>
                <th className="title-column">역할코드</th>
                <th className="author-column">역할명</th>
                <th className="date-column">최초등록자</th>
                <th className="date-column">최초등록일시</th>
                <th className="date-column">최종변경자</th>
              </tr>
            </thead>
            <tbody className="TableBody-ctn2" id ="TableBody" ref={topDivRef}>
              {roleList.map((role, index) => (
                <tr key={role.role_id} onClick={() => handleRowClick(index, role.role_id)} className={selectedRow === index ? 'selected' : ''}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* 1부터 시작하는 화면 번호 */}
                  <td>{role.role_code}</td>
                  <td>{role.role_name}</td>
                  <td>{role.create_user}</td>
                  <td>{new Date(role.create_dt).toLocaleString()}</td>
                  <td>{role.modify_user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="페이지-ctn2">
          <div id="left">
            페이지당 줄 수:
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="1000">1000</option>
            </select>
          </div>
          <div id="right">
            {isFirstLoad ?  null :(<>{otherInformation.current_page_data_min}-{(otherInformation.page_no === otherInformation.max_page_no) ? otherInformation.total_row : otherInformation.current_page_data_max} of {otherInformation.total_row} items </>)}        
            <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>&lt;&lt;</Button>
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</Button>
            {pagelist()}
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</Button>
            <Button onClick={() => handlePageChange(otherInformation.max_page_no)} disabled={currentPage === totalPages}>&gt;&gt;</Button> 
          </div>
        </div>
        <div className="resizer-ctn2" onMouseDown={handleMouseDown}></div>
        <div className="상세탭-ctn2" ref={bottomDivRef}>
          <div>상세정보</div>
          <table>
            <tbody>
              <tr>
                <td>역할ID</td>
                <td>{RoleDetail.role_id ? RoleDetail.role_id : '-'}</td>
                <td>역할코드</td>
                <td>{RoleDetail.role_code ? RoleDetail.role_code : '-'}</td>
              </tr>
              <tr>
                <td>역할명</td>
                <td>{RoleDetail.role_name ? RoleDetail.role_name : '-'}</td>
                <td>메타사용YN</td>
                <td>{RoleDetail.meta_use_yn ? RoleDetail.meta_use_yn : '-'}</td>
              </tr>
              <tr>
                <td>최초등록자</td>
                <td>{RoleDetail.create_dt ? RoleDetail.create_dt : '-'}</td>
                <td>최초등록일시</td>
                <td>{RoleDetail.create_user ? RoleDetail.create_user : '-'}</td>
              </tr>
              <tr>
                <td>최종변경자</td>
                <td>{RoleDetail.modify_dt ? RoleDetail.modify_dt : '-'}</td>
                <td>최종변경일시</td>
                <td>{RoleDetail.modify_user ? RoleDetail.modify_user : '-'}</td>
              </tr>
            </tbody>
          </table>
          {/* <div className="detail-item">
            <div className="item-label">메뉴 ID</div>
            <div className="item-value">{RoleDetail.menu_id ? RoleDetail.menu_id : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">메뉴 CODE</div>
            <div className="item-value">{RoleDetail.menu_code ? RoleDetail.menu_code : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">메뉴 명</div>
            <div className="item-value">{RoleDetail.menu_name ? RoleDetail.menu_name : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">메뉴 순서</div>
            <div className="item-value">{RoleDetail.menu_seq ? RoleDetail.menu_seq : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">상위 메뉴</div>
            <div className="item-value">{RoleDetail.org_menu_id ? RoleDetail.org_menu_id : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">사용 여부</div>
            <div className="item-value">{RoleDetail.use_yn ? RoleDetail.use_yn : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">메뉴 URL</div>
            <div className="item-value">{RoleDetail.menu_url ? RoleDetail.menu_url : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">생성일</div>
            <div className="item-value">{RoleDetail.create_dt ? RoleDetail.create_dt : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">생성자</div>
            <div className="item-value">{RoleDetail.create_user ? RoleDetail.create_user : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">변경일</div>
            <div className="item-value">{RoleDetail.modify_dt ? RoleDetail.modify_dt : '-'}</div>
          </div>
          <div className="detail-item">
            <div className="item-label">변경자</div>
            <div className="item-value">{RoleDetail.modify_user ? RoleDetail.modify_user : '-'}</div>
          </div> */}
        </div>
      </div>
    </div>
    
  );
}

export default RoleManagement;