import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import '../css/content-ctn1.css';

function CommunityBoard() {
  const [boardList, setBoardList] = useState([]);
  const [otherInformation, setOtherInformation] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);


    const fetchBoardList = async (page_no, page_cnt) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/board?page_no=${page_no}&page_cnt=${page_cnt}`);
        setBoardList(response.data.boardList);
        setOtherInformation(response.data.otherInformation);
      } catch (error) {
        console.error('Error fetching board list:', error);
      }
    };

  // 페이지가 처음 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchBoardList(currentPage, itemsPerPage);
  }, [currentPage]); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 호출

  const totalPages = otherInformation.max_page_no || 1;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
  };

  const handleSearch = () => {
    fetchBoardList(currentPage, itemsPerPage);
  };


  const pagelist = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
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
      <div className="메뉴명">
        <div>용어</div><div></div>
      </div>
      <div className="버튼"><Button>신규</Button><Button>수정</Button><Button>삭제</Button></div>
      <div className="검색조건"><Button onClick={handleSearch}>검색</Button></div>
      <div className="메인그리드">
        <table>
          <thead>
            <tr>
              <th>게시글 번호</th>
              <th>제목</th>
              <th>내용</th>
              <th>작성일시</th>
              <th>작성자</th>
              <th>수정일시</th>
              <th>수정자</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map(board => (
              <tr key={board.board_id}>
                <td>{board.board_id}</td>
                <td>{board.board_title}</td>
                <td>{board.board_contents}</td>
                <td>{new Date(board.create_dt).toLocaleString()}</td>
                <td>{board.create_user}</td>
                <td>{new Date(board.modify_dt).toLocaleString()}</td>
                <td>{board.modify_user}</td>
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
          1-{otherInformation.this_page_row} of {otherInformation.total_row} items 
           <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</Button>
          {pagelist()}
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</Button> 
        </div>
      </div>
    </div>
  );
}

export default CommunityBoard;