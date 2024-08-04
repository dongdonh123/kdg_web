import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/content-ctn3.css';
import Accordion from 'react-bootstrap/Accordion';
import { Button,Modal } from 'react-bootstrap';



function MenuManagement() {

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

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div>
      <div className="메뉴명">
        <div>메뉴관리</div>
      </div>
      <div className="메인컨텐츠">
        <div className="왼쪽트리">
          <div className="이름">메뉴트리 <Button onClick={handleShow}>신규</Button></div>
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
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Custom Modal Styling
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
      </Modal>

      
      
    </div>
  );
}

export default MenuManagement;