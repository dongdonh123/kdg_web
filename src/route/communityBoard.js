import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import '../css/content-ctn1.css';
import '../css/communityBoard.css';

function CommunityBoard() {
  const [boardList, setBoardList] = useState([]);
  const [otherInformation, setOtherInformation] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [showFilters, setShowFilters] = useState(false); //검색조건 영역 

  const [isAllChecked, setIsAllChecked] = useState(false); //체크박스
  const [checkedItems, setCheckedItems] = useState([]); //체크박스

  const handleAllCheck = () => {
    const newIsAllChecked = !isAllChecked;
    setIsAllChecked(newIsAllChecked);
    if (newIsAllChecked) {
      setCheckedItems(boardList.map(board => board.board_id));
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheck = (boardId) => {
    if (checkedItems.includes(boardId)) {
      setCheckedItems(checkedItems.filter(id => id !== boardId));
    } else {
      setCheckedItems([...checkedItems, boardId]);
    }
  };



  const fetchBoardList = async (page_no, page_cnt) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/board?page_no=${page_no}&page_cnt=${page_cnt}`);
      setBoardList(response.data.boardList);
      setOtherInformation(response.data.otherInformation);
      setIsFirstLoad(false);
    } catch (error) {
      console.error('Error fetching board list:', error);
    }
  };

 
  useEffect(() => {
    if (isFirstLoad) {
      
      return;
    }
    fetchBoardList(currentPage, itemsPerPage);
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
    fetchBoardList(currentPage, itemsPerPage);
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    const filtersDiv = document.getElementById('검색조건');
    const MainsDiv = document.getElementById('메인그리드'); 
    if (filtersDiv) {
      filtersDiv.style.height = showFilters ? '40px' : '80px';
      MainsDiv.style.height = showFilters ? 'calc(100vh - 216px)' : 'calc(100vh - 256px)';
    }
  };

  return (
    <div>
      <div className="메뉴명">
        <div>커뮤니티게시판</div><div></div>
      </div>
      <div className="버튼"><Button>신규</Button><Button>수정</Button><Button>삭제</Button></div>
      <div className="검색조건" id="검색조건">
        <button className="toggle-button" onClick={toggleFilters}>
          필터
        </button>
        <Button onClick={handleSearch}>검색</Button>
        {showFilters && (
          <div> 
            제목 : <input type="text" placeholder="제목 검색" />
            작성자 : <input type="text" placeholder="작성자 검색" />
            작성일 : <input type="date" placeholder="작성일 검색" /> ~ <input type="date" placeholder="작성일 검색" />
          </div>
        )}
      </div>
      <div className="메인그리드" id="메인그리드">
        <table className ="MainTable">
          <thead className="TableHeader">
            <tr>
              <th className="checkbox-column"><input type="checkbox"  checked={isAllChecked} onChange={handleAllCheck}/></th>
              <th className="number-column">번호</th>
              <th className="title-column">제목</th>
              <th className="author-column">작성자</th>
              <th className="date-column">작성일시</th>
            </tr>
          </thead>
          <tbody className="TableBody" id ="TableBody">
            {boardList.map((board, index) => (
              <tr key={board.board_id}>
                <td><input type="checkbox"  checked={checkedItems.includes(board.board_id)} onChange={() => handleCheck(board.board_id)}/></td>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* 1부터 시작하는 화면 번호 */}
                <td> {board.board_title} <input type="hidden" value={board.board_id} /> {/* hidden으로 보관하는 board_id */} </td>
                <td>{board.create_user}</td>
                <td>{new Date(board.create_dt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="페이지">
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
        {isFirstLoad ?  null :(
    <>
      {otherInformation.current_page_data_min}-{(otherInformation.page_no === otherInformation.max_page_no) ? otherInformation.total_row : otherInformation.current_page_data_max} of {otherInformation.total_row} items 
    </>
  )}        <Button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>&lt;&lt;</Button>
           <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</Button>
          {pagelist()}
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</Button>
          <Button onClick={() => handlePageChange(otherInformation.max_page_no)} disabled={currentPage === totalPages}>&gt;&gt;</Button> 
        </div>
      </div>
    </div>
  );
}

export default CommunityBoard;