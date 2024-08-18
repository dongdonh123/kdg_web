import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import '../../css/content-ctn1.css';
import '../../css/mainTable/CommunityBoard.css';

function CommunityBoard() {
  const [boardList, setBoardList] = useState([]);
  const [otherInformation, setOtherInformation] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showFilters, setShowFilters] = useState(false); //검색조건 영역 
  const [isAllChecked, setIsAllChecked] = useState(false); //체크박스
  const [checkedItems, setCheckedItems] = useState([]); //체크박스
  const [board_id, setBoard_id] = useState('');

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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= otherInformation.max_page_no || 1) {
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    const filtersDiv = document.getElementById('read_button');
    const MainsDiv = document.getElementById('maincontent'); 
    if (filtersDiv) {
      filtersDiv.style.height = showFilters ? '40px' : '80px';
      MainsDiv.style.height = showFilters ? 'calc(100vh - 216px)' : 'calc(100vh - 256px)';
    }
  };

  // 메인테이블 선택시 배경색 바꾸고 id 선택하기
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (index, board_id) => {
    setBoard_id(board_id)
    setSelectedRow(index);
  };

  return (
    <div>
      <div className="title-ctn1">
        <div>커뮤니티게시판</div><div></div>
      </div>
      <div className="cud_button-ctn1"><Button>신규</Button><Button>수정</Button><Button>삭제</Button></div>
      <div className="read_button-ctn1" id="read_button">
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
      <div className="maincontent-ctn1" id="maincontent">
        <table className ="MainTable">
          <thead className="TableHeader">
            <tr>
              <th className="board-checkbox"><input type="checkbox"  checked={isAllChecked} onChange={handleAllCheck}/></th>
              <th className="board-number">번호</th>
              <th className="board-title">제목</th>
              <th className="board-createuser">작성자</th>
              <th className="board-createdt">작성일시</th>
            </tr>
          </thead>
          <tbody className="TableBody-ctn1">
            {boardList.map((board, index) => (
              <tr key={board.board_id} onClick={() => handleRowClick(index, board.board_id)} className={selectedRow === index ? 'selected' : ''}>
                <td className="board-checkbox"><input type="checkbox"  checked={checkedItems.includes(board.board_id)} onChange={() => handleCheck(board.board_id)}/></td>
                <td className="board-number">{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* 1부터 시작하는 화면 번호 */}
                <td className="board-title"> {board.board_title} <input type="hidden" value={board.board_id} /> {/* hidden으로 보관하는 board_id */} </td>
                <td className="board-createuser">{board.create_user}</td>
                <td className="board-createdt">{new Date(board.create_dt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={otherInformation.max_page_no || 1} onPageChange={handlePageChange} onItemsPerPageChange={handleItemsPerPageChange} itemsPerPage={itemsPerPage} totalItems={otherInformation} isFirstLoad={isFirstLoad}/>
      
    </div>
  );
}

export default CommunityBoard;