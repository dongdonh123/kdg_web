import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/content-ctn3.css';
import Accordion from 'react-bootstrap/Accordion';
import Modal from 'react-modal';
import Button from '../../components/Button_.js';
import { GridContainer, FormItem, Label, Input, ButtonContainer, InsertModalStyles, DeleteModalStyles, Required, LabelDiv } from '../../css/Modalcss.js';
import '../../css/detail-div.css'



function MenuManagement() {

  //사용하는 useState
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [MenuTreeList, setMenuTreeList] = useState([]); //왼쪽 메뉴트리 데이터
  const [MenuDetail, setMenuDetail] = useState({        //오른쪽 메뉴정보 데이터
    menu_id:'-',
    menu_code:'-',
    menu_name:'-',
    menu_seq:'-',
    org_menu_id:'-',
    use_yn:'-',
    menu_url:'-',
    create_dt:'-',
    create_user:'-',
    modify_dt:'-',
    modify_user:'-'                    
  }); 
  const [menuSeq, setMenuSeq] = useState(''); // 메뉴순서 항목의 문자열감지를 위한 useState
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
  

  //메뉴순서 문자열감지 + 항목수정
  const handleMenuSeqChange_handleInputChange = (event) => {
    handleInputChange(event);
    handleMenuSeqChange(event);
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuDetail({
        ...MenuDetail,
        [name]: value,
    });
  };

  //왼쪽트리 리스트 api로 가져오는 부분 
  const fetchMenuTree = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/menuMenegement`);
      setMenuTreeList(response.data.menuTreeList);

    } catch (error) {
      console.error('Error fetching menu list:', error);
      alert("z");
    }
  };

  //처음 화면 로딩시에만 왼쪽 트리 데이터 가져오기 1회 실행
  useEffect(() => {
    fetchMenuTree();
  }, []);

  //오른쪽 메뉴상세정보 api로 가져오는 부분 
  const fetchMenuDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/menuMenegement/${menuInfo.menu_id}`);
      setMenuDetail(response.data.menuDetail);

    } catch (error) {
      console.error('Error fetching menu list:', error);
    }
  };

  //메뉴id가 변경될때마다 오른쪽 상세정보 데이터 가져오기
  useEffect(() => {
    fetchMenuDetail();
  }, [menuInfo]);


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
      alert('메뉴데이터를 등록 했습니다.');
      insertModalClose();
      fetchMenuTree();  // 데이터 갱신
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('메뉴데이터를 등록을 실패했습니다.');
    }
  };

  //수정등록 api 호출부분 
  const handleUpdate = async (event) => {
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
      const response = await axios.put(`http://localhost:8080/api/admin/menuMenegement/${menuInfo.menu_id}`, data);
      console.log('Response:', response.data);
      alert('메뉴데이터를 수정을 성공했습니다.');
      updateModalClose();
      fetchMenuTree();  // 왼쪽트리데이터 갱신
      fetchMenuDetail(); // 오른쪽상세데이터 갱신
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('메뉴데이터를 수정을 실패했습니다.');
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
          <div className="타이틀영역"><div className="타이틀">메뉴트리</div><Button primary onClick={insertModalShow}>신규</Button></div>
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
          <div className="타이틀영역"><div className="타이틀">메뉴 상세정보</div><Button primary onClick={updateModalShow} >수정</Button> <Button primary onClick={deleteModalShow}>삭제</Button></div>
          <div className="메뉴정보컨텐츠">
            <div className="detail-item">
              <div className="item-label">메뉴 ID</div>
              <div className="item-value">{MenuDetail.menu_id ? MenuDetail.menu_id : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">메뉴 CODE</div>
              <div className="item-value">{MenuDetail.menu_code ? MenuDetail.menu_code : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">메뉴 명</div>
              <div className="item-value">{MenuDetail.menu_name ? MenuDetail.menu_name : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">메뉴 순서</div>
              <div className="item-value">{MenuDetail.menu_seq ? MenuDetail.menu_seq : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">상위 메뉴</div>
              <div className="item-value">{MenuDetail.org_menu_id ? MenuDetail.org_menu_id : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">사용 여부</div>
              <div className="item-value">{MenuDetail.use_yn ? MenuDetail.use_yn : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">메뉴 URL</div>
              <div className="item-value">{MenuDetail.menu_url ? MenuDetail.menu_url : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">생성일</div>
              <div className="item-value">{MenuDetail.create_dt ? MenuDetail.create_dt : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">생성자</div>
              <div className="item-value">{MenuDetail.create_user ? MenuDetail.create_user : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">변경일</div>
              <div className="item-value">{MenuDetail.modify_dt ? MenuDetail.modify_dt : '-'}</div>
            </div>
            <div className="detail-item">
              <div className="item-label">변경자</div>
              <div className="item-value">{MenuDetail.modify_user ? MenuDetail.modify_user : '-'}</div>
            </div>
          </div>  
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
                    <Input type="text" id="메뉴순서" name="menu_seq" onChange={handleMenuSeqChange}/>
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


      {/* 수정 모달창 */}
      <Modal
        isOpen={updateModalOpen}
        onRequestClose={updateModalClose}
        style={InsertModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>메뉴 데이터 수정 등록</h2>
          <form onSubmit={handleUpdate}>
            <GridContainer>
                <FormItem key="1">
                  <LabelDiv>
                    <Label htmlFor="메뉴코드">메뉴코드</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="메뉴코드" name="menu_code" value={MenuDetail.menu_code} onChange={handleInputChange}/>
                </FormItem>
                <FormItem key="2">
                  <LabelDiv>
                    <Label htmlFor="메뉴명">메뉴명</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="메뉴명" name="menu_name" value={MenuDetail.menu_name} onChange={handleInputChange}/>
                </FormItem>
                <FormItem key="3">
                  <LabelDiv>
                    <Label htmlFor="메뉴순서">메뉴순서</Label>
                  </LabelDiv>
                    <Input type="text" id="메뉴순서" name="menu_seq" value={MenuDetail.menu_seq} onChange={handleMenuSeqChange_handleInputChange}/>
                </FormItem>
                <FormItem key="4">
                  <LabelDiv>
                    <Label htmlFor="상위메뉴">상위메뉴</Label>
                  </LabelDiv>
                  <Input type="text" disabled id="상위메뉴" name="org_menu_id" value={MenuDetail.org_menu_id} onChange={handleInputChange}/>
                </FormItem>
                <FormItem key="5">
                  <LabelDiv>
                    <Label htmlFor="사용여부">사용여부</Label>
                  </LabelDiv>
                  <Input type="checkbox" id="사용여부" name="use_yn" value={MenuDetail.menu_use_yn} onChange={handleInputChange}/>
                </FormItem>
                <FormItem key="6">
                  <LabelDiv>
                    <Label htmlFor="메뉴URL">메뉴URL</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="메뉴URL" name="menu_url" value={MenuDetail.menu_url} onChange={handleInputChange}/>
                </FormItem>
            </GridContainer>
            <ButtonContainer>
              <Button primary type="submit">수정</Button>
              <Button onClick={updateModalClose}>닫기</Button>
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