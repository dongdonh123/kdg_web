import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/content-ctn3.css';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-modal';
import Button from '../components/Button_.js';
import { GridContainer, FormItem, Label, Input, ButtonContainer, InsertModalStyles, DeleteModalStyles, Required, LabelDiv } from '../css/insertModalcss.js';



function MenuManagement() {

  //사용하는 useState
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [MenuTreeList, setMenuTreeList] = useState([]); //왼쪽 메뉴트리 데이터
  const [MenuDetail, setMenuDetail] = useState([]); //오른쪽 메뉴정보 데이터 
  const [menuSeq, setMenuSeq] = useState(''); // 메뉴순서의 문자열감지를 위한 useState
  const [orgMenuInfo, setOrgMenuInfo] = useState({ top_menu_id: '', top_menu_name: '' }); 
  const [menuInfo, setMenuInfo] = useState({ menu_id: '', menu_name: '' }); //메뉴ID저장을 위한 useState

  //클릭시 메뉴ID 저장하는 처리
  const handleTopMenuClick = (menu_id, menu_name, top_menu_id, top_menu_name) => {
    top_menu_id = menu_id;
    top_menu_name = menu_name;
    setOrgMenuInfo({ top_menu_id, top_menu_name });
    setMenuInfo({menu_id, menu_name});
  };

  const handleChildMenuClick = (menu_id, menu_name) => {
    setMenuInfo({menu_id, menu_name});
  };

  // 모달처리
  const insertModalShow = () => setInsertModalOpen(true);
  const insertModalClose = () => setInsertModalOpen(false);
  const updateModalShow = () => setUpdateModalOpen(true);
  const updateModalClose = () => setUpdateModalOpen(false);
  const deleteModalShow = () => setDeleteModalOpen(true);
  const deleteModalClose = () => setDeleteModalOpen(false);
  

  //메뉴순서 문자열감지
  const handleMenuSeqChange = (event) => {
    const value = event.target.value;

    // 입력값이 숫자인지 확인
    if (isNaN(value) && value.trim() !== '') {
      alert('메뉴순서는 숫자만 입력 가능합니다.');
      setMenuSeq(''); // 입력값 초기화
    } else {
      setMenuSeq(value); // 유효한 숫자일 경우 상태 업데이트
    }
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
  const fetchMenuDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/${menuInfo.menu_id}`);
      setMenuDetail(response.data.menuTreeList);

    } catch (error) {
      console.error('Error fetching menu list:', error);
    }
  };

  useEffect(() => {
    fetchMenuTree();
  }, []);

  //신규등록 api 호출부분 
  const handleInsert = async (event) => {
    event.preventDefault();

    const menuCode = event.target.menu_code.value.trim();
    const menuName = event.target.menu_name.value.trim();
    const menuUrl = event.target.menu_url.value.trim();
    const use_yn = event.target.use_yn.checked ? 'Y' : 'N'; //체크박스의 체크 여부 확인
    if (!menuCode) {
      alert('메뉴코드는 필수값입니다.')
      return;
    }

    if (!menuName) {
      alert('메뉴명은 필수값입니다.');
      return;
    }

    if (!menuUrl) {
      alert('메뉴URL은 필수값입니다.');
      return;
    }

    const formData = new FormData(event.target);
    formData.set('use_yn', use_yn); // 체크박스의 값을 'Y' 또는 'N'으로 변경
    formData.set('org_menu_id', orgMenuInfo.top_menu_id);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post('http://localhost:8080/api/admin/menuMenegement', data);
      console.log('Response:', response.data);
      insertModalClose();
      fetchMenuTree();  // 데이터 갱신
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  //삭제 api 호출 부분
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/menuMenegement/${menuInfo.menu_id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('메뉴가 삭제되었습니다.');
        // 추가적인 성공 처리 (예: 상태 업데이트, 모달 닫기 등)
        fetchMenuTree();  // 데이터 갱신
        deleteModalClose();
      } else {
        alert('메뉴 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 중 오류 발생:', error);
      alert('서버 오류로 인해 메뉴 삭제에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="메뉴명">
        <div>메뉴관리</div>
      </div>
      <div className="메인컨텐츠">
        <div className="왼쪽트리">
          <div className="이름">메뉴트리 <Button onClick={insertModalShow}>신규</Button></div>
          <div className="메뉴트리컨텐츠">
          <Accordion alwaysOpen>
            {MenuTreeList.map((menu, index) => (
                <Accordion.Item eventKey={index.toString()} key={menu.top_menu_id}>
                    <Accordion.Header onClick={() => handleTopMenuClick(menu.top_menu_id, menu.top_menu_name)}>{menu.top_menu_name}</Accordion.Header>
                    <Accordion.Body>
                        {menu.child_munu_name_list.length > 0 ? (
                            menu.child_munu_name_list.map((childMenu, childIndex) => (
                                <div key={menu.child_menu_id_list[childIndex]}>
                                    <span onClick={() => handleChildMenuClick(menu.child_menu_id_list[childIndex],childMenu)}>{childMenu}</span>
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
          <div className="이름">메뉴정보 <Button>수정</Button> <Button onClick={deleteModalShow}>삭제</Button></div>
          <div className="메뉴정보컨텐츠">메뉴정보컨텐츠</div>  
        </div>

      </div>
      
      {/* 신규등록 모달창 */}
      <Modal
        isOpen={insertModalOpen}
        onRequestClose={insertModalClose}
        style={InsertModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>메뉴 데이터 신규 등록</h2>
          <form onSubmit={handleInsert}>
            <GridContainer>
                <FormItem key="1">
                  <LabelDiv>
                    <Label htmlFor="메뉴코드">메뉴코드</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="메뉴코드" name="menu_code"/>
                </FormItem>
                <FormItem key="2">
                  <LabelDiv>
                    <Label htmlFor="메뉴명">메뉴명</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="메뉴명" name="menu_name"/>
                </FormItem>
                <FormItem key="3">
                  <LabelDiv>
                    <Label htmlFor="메뉴순서">메뉴순서</Label>
                  </LabelDiv>
                    <Input type="text" id="메뉴순서" name="menu_seq" value={menuSeq} onChange={handleMenuSeqChange}/>
                </FormItem>
                <FormItem key="4">
                  <LabelDiv>
                    <Label htmlFor="상위메뉴">상위메뉴</Label>
                  </LabelDiv>
                  <Input type="text" disabled id="상위메뉴" name="org_menu_id" value={orgMenuInfo.top_menu_name}/>
                </FormItem>
                <FormItem key="5">
                  <LabelDiv>
                    <Label htmlFor="사용여부">사용여부</Label>
                  </LabelDiv>
                  <Input type="checkbox" id="사용여부" name="use_yn" />
                </FormItem>
                <FormItem key="6">
                  <LabelDiv>
                    <Label htmlFor="메뉴URL">메뉴URL</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="메뉴URL" name="menu_url"/>
                </FormItem>
            </GridContainer>
            <ButtonContainer>
              <Button primary type="submit">등록</Button>
              <Button onClick={insertModalClose}>닫기</Button>
            </ButtonContainer>
          </form>
        </div>
      </Modal>

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
          <h2>메뉴 데이터 삭제</h2>
          {menuInfo.menu_id} {menuInfo.menu_name}메뉴를 삭제하시겠습니까?
          <ButtonContainer>
            <Button primary onClick={handleDelete}>삭제</Button>
            <Button onClick={deleteModalClose}>닫기</Button>
          </ButtonContainer>
        </div>
      </Modal>
      


      

      
      
    </div>
  );
}

export default MenuManagement;