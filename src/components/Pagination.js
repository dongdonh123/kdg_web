
import React from 'react';
import { Button } from 'react-bootstrap';
import '../css/componunt/Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onItemsPerPageChange, 
  itemsPerPage, 
  totalItems, 
  isFirstLoad 
}) => {
  
  const pagelist = () => {
    let pages = [];
    let start = Math.max(1, (Math.floor((currentPage - 1) / 10) * 10) + 1); // 시작 페이지
    let end = Math.min(start + 9, totalPages); // 끝 페이지는 최대 totalPages까지
    for (let i = start; i <= end; i++) {
      pages.push(
        <Button key={i} onClick={() => onPageChange(i)} disabled={i === currentPage}>
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="pagediv">
      <div id="left">
        페이지당 줄 수:
        <select value={itemsPerPage} onChange={onItemsPerPageChange}>
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
        {!isFirstLoad && (
          <>
            {totalItems.current_page_data_min}-{(currentPage === totalPages ? totalItems.total_row : totalItems.current_page_data_max)} of {totalItems.total_row} items 
          </>
        )}
        <Button onClick={() => onPageChange(1)} disabled={currentPage === 1}>&lt;&lt;</Button>
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</Button>
        {pagelist()}
        <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</Button>
        <Button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>&gt;&gt;</Button>
      </div>
    </div>
  );
};

export default Pagination;