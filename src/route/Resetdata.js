import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/content-ctn3.css';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-modal';
import Button from '../components/Button_.js';
import { ButtonContainer,DeleteModalStyles } from '../css/Modalcss.js';
import '../css/detail-div.css'

import '../css/detail-div.css'


function Resetdata() {

  //모달처리
  const deleteModalShow = () => setDeleteModalOpen(true);
  const deleteModalClose = () => setDeleteModalOpen(false);
  const resetModalShow = () => setResetModalOpen(true);
  const resetModalClose = () => setResetModalOpen(false);


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [MenuTreeList, setMenuTreeList] = useState([]); //왼쪽 메뉴트리 데이터
  const [DataResetDatail, setDataResetDatail] = useState({
    init_id:'-',
    menu_id:'-',
    menu_name:'-',
    table_id:'-',
    data_ctn:'-',
    init_sql:'-',
    create_dt:'-',
    create_user:'-',
    modify_dt:'-',
    modify_user:'-'                    
  }); //오른쪽 상세데이터
  const [current_cnt, setCurrent_cnt] = useState('-'); //메뉴ID저장을 위한 useState
  const [menuInfo, setMenuInfo] = useState({ menu_id: '', menu_name: '' }); //메뉴ID저장을 위한 useState

  const handleMenuClick = (menu_id, menu_name) => {
    setMenuInfo({menu_id, menu_name});
  };

  //왼쪽트리 리스트 api로 가져오는 부분 
  const fetchMenuTree = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/menuMenegement`);
      setMenuTreeList(response.data.menuTreeList);

    } catch (error) {
      console.error('Error fetching menu list:', error);
    }
  };

  //오른쪽 메뉴상세정보 api로 가져오는 부분 
  const fetchInitDataDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/maintenance/resetdata/${menuInfo.menu_id}`);
      setDataResetDatail(response.data.initDataDetail);
      setCurrent_cnt(response.data.current_cnt);
      
      if(response.data.details){
        alert(response.data.details);
      }

    } catch (error) {
      console.error('Error fetching menu list:', error);
    }
  };

  //처음 화면 로딩시에만 왼쪽 트리 데이터 가져오기 1회 실행
  useEffect(() => {
    fetchMenuTree();
  }, []);

  //메뉴id가 변경될때마다 오른쪽 상세정보 데이터 가져오기
  useEffect(() => {
    fetchInitDataDetail();
  }, [menuInfo]);

  //삭제 api 호출 부분
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/maintenance/resetdata/${menuInfo.menu_id}`);

        alert(response.data.details);
        // 추가적인 성공 처리 (예: 상태 업데이트, 모달 닫기 등)
        fetchInitDataDetail();  // 데이터 갱신
        deleteModalClose();
      
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('서버 오류로 인해 메뉴 삭제에 실패했습니다.');
    }
  };

  //리셋 api 호출 부분
  const handleReset = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/api/maintenance/resetdata/${menuInfo.menu_id}`);

        alert(response.data.details);
        // 추가적인 성공 처리 (예: 상태 업데이트, 모달 닫기 등)
        fetchInitDataDetail();  // 데이터 갱신
        resetModalClose();
      
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('서버 오류로 인해 메뉴 삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="메뉴명">
        <div>데이터리셋</div>
      </div>
      <div className="메인컨텐츠">
      <div className="왼쪽트리">
          <div className="타이틀영역"><div className="타이틀">메뉴트리</div></div>
          <div className="메뉴트리컨텐츠">
          <Accordion alwaysOpen>
            {MenuTreeList.map((menu, index) => (
                <Accordion.Item eventKey={index.toString()} key={menu.top_menu_id}>
                    <Accordion.Header >{menu.top_menu_name}</Accordion.Header>
                    <Accordion.Body>
                        {menu.child_munu_name_list.length > 0 ? (
                            menu.child_munu_name_list.map((childMenu, childIndex) => (
                                <div key={menu.child_menu_id_list[childIndex]}>
                                    <span onClick={() => handleMenuClick(menu.child_menu_id_list[childIndex],childMenu)}>{childMenu}</span>
                                    {childIndex < menu.child_munu_name_list.length - 1 && <hr />}
                                </div>
                            ))
                        ) : (
                            null
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            ))}
          </Accordion>
          </div>
        </div>
        <div className="오른쪽정보">
          <div className="타이틀영역"><div className="타이틀">데이터리셋 상세정보</div><Button primary onClick={deleteModalShow}>삭제</Button> <Button primary onClick={resetModalShow}>리셋</Button></div>
          <div className="메뉴정보컨텐츠">
            <div className="detail-item">
              <div className="item-label">데이터초기화 ID</div>
              <div className="item-value">{DataResetDatail && DataResetDatail.init_id ? DataResetDatail.init_id : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">메뉴 ID</div>
              <div className="item-value">{DataResetDatail && DataResetDatail.menu_id ? DataResetDatail.menu_id : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">메뉴 명</div>
              <div className="item-value">{DataResetDatail && DataResetDatail.menu_name ? DataResetDatail.menu_name : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">테이블 명</div>
              <div className="item-value">{DataResetDatail && DataResetDatail.table_id ? DataResetDatail.table_id : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">초기화 데이터 수</div>
              <div className="item-value">{DataResetDatail && DataResetDatail.data_ctn ? DataResetDatail.data_ctn : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">현재 데이터 수</div>
              <div className="item-value">{current_cnt !== null && current_cnt !== undefined ? current_cnt : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">리셋 SQL</div>
            </div>
            <div className="리셋SQL">{DataResetDatail && DataResetDatail.init_sql ? (<pre>{DataResetDatail.init_sql}</pre>) : '-'}</div>
          </div>
        </div>

      </div>

      {/* 삭제 모달창 */}
      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={deleteModalClose}
        style={DeleteModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>삭제</h2>
          {menuInfo.menu_name} 메뉴의 데이터를 삭제하시겠습니까?
          <ButtonContainer>
            <Button primary onClick={handleDelete}>삭제</Button>
            <Button onClick={deleteModalClose}>닫기</Button>
          </ButtonContainer>
        </div>
      </Modal>

      {/* 리셋 모달창 */}
      <Modal
        isOpen={resetModalOpen}
        onRequestClose={resetModalClose}
        style={DeleteModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>리셋</h2>
          {menuInfo.menu_name} 메뉴의 데이터를 리셋하시겠습니까?
          <ButtonContainer>
            <Button primary onClick={handleReset}>리셋</Button>
            <Button onClick={resetModalClose}>닫기</Button>
          </ButtonContainer>
        </div>
      </Modal>
      
      
    </div>
  );
}

export default Resetdata;