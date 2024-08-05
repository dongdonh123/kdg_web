import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/content-ctn3.css';
import Accordion from 'react-bootstrap/Accordion';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import styled from 'styled-components';  // styled를 styled-components에서 가져옴



function MenuManagement() {

  const [modalOpen, setModalOpen] = useState(false);
  const [MenuTreeList, setMenuTreeList] = useState([]);

  const fetchMenuList = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/menuMenegement`);
      setMenuTreeList(response.data.menuTreeList);

    } catch (error) {
      console.error('Error fetching menu list:', error);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, []);


  const modalShow = () => setModalOpen(true);
  const modalClose = () => setModalOpen(false);

  //모달 css
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '8px',
      width: '1200px',
    },
  };
  
  const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  `;
  
  const FormItem = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    label {
    width: 100px;  // 라벨의 너비를 고정하여 정렬을 쉽게 합니다.
    margin-right: 10px;  // 라벨과 입력 필드 사이의 간격
    font-weight: bold;
  }

  input {
    flex: 1;  // 입력 필드가 남은 공간을 차지하도록 설정
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  `;
  
  const Label = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
    width: 100px;  // 라벨의 너비를 고정하여 정렬을 쉽게 합니다.
    margin-right: 10px;  // 라벨과 입력 필드 사이의 간격
  `;
  
  const Input = styled.input`
    flex: 1;  // 입력 필드가 남은 공간을 차지하도록 설정
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  `;
  
  const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  `;
  
  const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    background-color: ${(props) => (props.primary ? '#007BFF' : '#6c757d')};
  
    &:hover {
      background-color: ${(props) => (props.primary ? '#0056b3' : '#5a6268')};
    }
  `;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post('http://localhost:8080/api/admin/menuMenegement', data);
      console.log('Response:', response.data);
      modalClose();
      fetchMenuList();  // 데이터 갱신
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <div className="메뉴명">
        <div>메뉴관리</div>
      </div>
      <div className="메인컨텐츠">
        <div className="왼쪽트리">
          <div className="이름">메뉴트리 <Button onClick={modalShow}>신규</Button></div>
          <div className="메뉴트리컨텐츠">
          <Accordion alwaysOpen>
            {MenuTreeList.map((menu, index) => (
                <Accordion.Item eventKey={index.toString()} key={menu.top_menu_id}>
                    <Accordion.Header>{menu.top_menu_name}</Accordion.Header>
                    <Accordion.Body>
                        {menu.child_munu_name_list.length > 0 ? (
                            menu.child_munu_name_list.map((childMenu, childIndex) => (
                                <div key={menu.child_menu_id_list[childIndex]}>
                                    <span>{childMenu}</span>
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
          <div className="이름">메뉴정보 <Button>수정</Button> <Button>삭제</Button></div>
          <div className="메뉴정보컨텐츠">메뉴정보컨텐츠</div>  
        </div>

      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={modalClose}
        style={customModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>메뉴 데이터 신규 등록</h2>
          <form onSubmit={handleSubmit}>
            <GridContainer>
                <FormItem key="1">
                  <Label htmlFor="메뉴코드">메뉴코드</Label>
                  <Input type="text" id="메뉴코드" name="menu_code"/>
                </FormItem>
                <FormItem key="2">
                  <Label htmlFor="메뉴명">메뉴명</Label>
                  <Input type="text" id="메뉴명" name="menu_name"/>
                </FormItem>
                <FormItem key="3">
                  <Label htmlFor="메뉴순서">메뉴순서</Label>
                  <Input type="text" id="메뉴순서" name="menu_seq"/>
                </FormItem>
                <FormItem key="4">
                  <Label htmlFor="상위메뉴">상위메뉴</Label>
                  <Input type="text" disabled id="상위메뉴" name="org_menu_id" />
                </FormItem>
                <FormItem key="5">
                  <Label htmlFor="사용여부">사용여부</Label>
                  <Input type="checkbox" id="사용여부" name="use_yn" />
                </FormItem>
                <FormItem key="6">
                  <Label htmlFor="메뉴URL">메뉴URL</Label>
                  <Input type="text" id="메뉴URL" name="menu_url"/>
                </FormItem>
            </GridContainer>
            <ButtonContainer>
              <Button primary type="submit">등록</Button>
              <Button onClick={modalClose}>닫기</Button>
            </ButtonContainer>
          </form>
        </div>
      </Modal>
      


      

      
      
    </div>
  );
}

export default MenuManagement;