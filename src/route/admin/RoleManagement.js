import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import '../../css/content-ctn2.css';
import Resizer from '../../components/ResizerRow'; // Resizer 컴포넌트 가져오기
import Pagination from '../../components/Pagination';
import '../../css/mainTable/RoleManagement.css'
import RoleDetailTable from '../../detailtap/RoleDetailTable';
import { GridContainer, FormItem, Label, Input, ButtonContainer, InsertModalStyles, DeleteModalStyles, Required, LabelDiv } from '../../css/componunt/Modalcss.js';
import Modal from 'react-modal';

function RoleManagement() {
  
  // 모달처리 시작
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const insertModalShow = () => setInsertModalOpen(true);
  const insertModalClose = () => setInsertModalOpen(false);
  const updateModalShow = () => setUpdateModalOpen(true);
  const updateModalClose = () => setUpdateModalOpen(false);
  const deleteModalShow = () => setDeleteModalOpen(true);
  const deleteModalClose = () => setDeleteModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleDetail({
        ...RoleDetail,
        [name]: value,
    });
  };

  //신규등록 api 호출부분 
  const handleInsert = async (event) => {
    event.preventDefault();

    const roleCode = event.target.role_code.value.trim();
    const roleName = event.target.role_name.value.trim();
    const meta_use_yn = event.target.meta_use_yn.checked ? 'Y' : 'N'; //체크박스의 체크 여부 확인
    if (!roleCode) {
      alert('역할코드는 필수값입니다.')
      return;
    }

    if (!roleName) {
      alert('역할명은 필수값입니다.');
      return;
    }

    const formData = new FormData(event.target);
    formData.set('meta_use_yn', meta_use_yn); // 체크박스의 값을 'Y' 또는 'N'으로 변경

    const data = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post('http://localhost:8080/api/admin/role', data);
      alert(response.data.resultmessage);
      insertModalClose();
      fetchRoleList(currentPage, itemsPerPage, filterList);  // 데이터 갱신
    } catch (error) {
      console.error('역할 신규 등록 중 오류 발생:', error);
      alert('서버 오류로 인해 역할 신규 등록을 실패했습니다.');
    }
  };

  //수정등록 api 호출부분 
  const handleUpdate = async (event) => {
    event.preventDefault();

    const roleCode = event.target.role_code.value.trim();
    const roleName = event.target.role_name.value.trim();
    const meta_use_yn = event.target.meta_use_yn.checked ? 'Y' : 'N'; //체크박스의 체크 여부 확인
    if (!roleCode) {
      alert('역할코드는 필수값입니다.')
      return;
    }

    if (!roleName) {
      alert('역할명은 필수값입니다.');
      return;
    }

    const formData = new FormData(event.target);
    formData.set('meta_use_yn', meta_use_yn); // 체크박스의 값을 'Y' 또는 'N'으로 변경

    const data = Object.fromEntries(formData.entries());
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/role/${RoleDetail.role_id}`, data);
      alert(response.data.resultmessage);
      updateModalClose();
      fetchRoleList(currentPage, itemsPerPage, filterList);  
    } catch (error) {
      console.error('역할 수정 등록 중 오류 발생:', error);
      alert('서버 오류로 인해 역할 수정 등록을 실패했습니다.');
    }
  };

  //삭제 api 호출 부분
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/role/${RoleDetail.role_id}`);
      alert(response.data.resultmessage);
      fetchRoleList(currentPage, itemsPerPage, filterList);  // 데이터 갱신
      deleteModalClose();
    } catch (error) {
      console.error('역할 삭제 중 오류 발생:', error);
      alert('서버 오류로 인해 역할 삭제를 실패했습니다.');
    }
  };

  // 모달처리 끝

  const containerRef = useRef(null);
  const topDivRef = useRef(null);
  const bottomDivRef = useRef(null);

  const [roleList, setRoleList] = useState([]);
  const [otherInformation, setOtherInformation] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [role_id, setRole_id] = useState('');

  const [filterList, setFilterList] = useState({role_name:''});
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
  const fetchRoleList = async (page_no, page_cnt, filterList) => {
    try {
      // 기본 URL 설정
      let url = `http://localhost:8080/api/admin/role?page_no=${page_no}&page_cnt=${page_cnt}`;
      // role_name이 정의되어 있고 빈 값이 아닌 경우에만 URL에 추가
      if (filterList.role_name !== undefined && filterList.role_name !== null && filterList.role_name.trim() !== '') {
        url += `&role_name=${encodeURIComponent(filterList.role_name)}`;
      }
      const response = await axios.get(url);
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


  useEffect(() => {
    if (isFirstLoad) {
      return;
    }
    fetchRoleList(currentPage, itemsPerPage, filterList );
  }, [currentPage,itemsPerPage]); 

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
    fetchRoleList(currentPage, itemsPerPage, filterList);
  };


  return (
    <div>
      <div className="content_container-ctn2" ref={containerRef}>
        <div className="title-ctn2"><div>역할관리</div></div>
        <div className="cud_button-ctn2"><Button onClick={insertModalShow}>신규</Button><Button onClick={updateModalShow}>수정</Button><Button onClick={deleteModalShow}>삭제</Button></div>
        <div className="read_button-ctn2" id="검색조건">
          <div id="left">역할명 : <input type="text" placeholder="역할명 검색" onChange={(e) => setFilterList({ role_name: e.target.value })} /></div>
          <div id="right"><Button onClick={handleSearch}>검색</Button></div>
        </div>
        <div className="maincontent-ctn2" id="메인그리드" >
          <table className ="MainTable">
            <thead className="TableHeader">
              <tr>
                <th className="role-num">번호</th>
                <th className="role-code">역할코드</th>
                <th className="role-name">역할명</th>
                <th className="role-createuser">최초등록자</th>
                <th className="role-createdt">최초등록일시</th>
                <th className="role-modifyuser">최종변경자</th>
              </tr>
            </thead>
            <tbody className="TableBody-ctn2" id ="TableBody" ref={topDivRef}>
              {roleList.map((role, index) => (
                <tr key={role.role_id} onClick={() => handleRowClick(index, role.role_id)} className={selectedRow === index ? 'selected' : ''}>
                  <td className="role-num">{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* 1부터 시작하는 화면 번호 */}
                  <td className="role-code">{role.role_code}</td>
                  <td className="role-name">{role.role_name}</td>
                  <td className="role-createuser">{role.create_user}</td>
                  <td className="role-createdt">{new Date(role.create_dt).toLocaleString()}</td>
                  <td className="role-modifyuser">{role.modify_user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={otherInformation.max_page_no || 1} onPageChange={handlePageChange} onItemsPerPageChange={handleItemsPerPageChange} itemsPerPage={itemsPerPage} totalItems={otherInformation} isFirstLoad={isFirstLoad}/>
        <Resizer containerRef={containerRef} topDivRef={topDivRef} bottomDivRef={bottomDivRef} />
        <div className="detailstap-ctn2" ref={bottomDivRef}>
          <div>상세정보</div>
          <RoleDetailTable RoleDetail={RoleDetail} />
        </div>
      </div>


      {/* 신규등록 모달창 */}
      <Modal isOpen={insertModalOpen} 
             onRequestClose={insertModalClose} 
             style={InsertModalStyles} 
             ariaHideApp={false} 
             contentLabel="Pop up Message" 
             shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>역할 신규 등록</h2>
          <form onSubmit={handleInsert}>
            <GridContainer>
                <FormItem key="1">
                  <LabelDiv>
                    <Label htmlFor="역할코드">역할코드</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="역할코드" name="role_code"/>
                </FormItem>
                <FormItem key="2">
                  <LabelDiv>
                    <Label htmlFor="역할명">역할명</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="역할명" name="role_name"/>
                </FormItem>
                <FormItem key="3">
                  <LabelDiv>
                    <Label htmlFor="메타사용여부">메타사용여부</Label>
                  </LabelDiv>
                    <Input type="checkbox" id="메타사용여부" name="meta_use_yn"/>
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
          <h2>역할 수정 등록</h2>
          <form onSubmit={handleUpdate}>
            <GridContainer>
                <FormItem key="1">
                  <LabelDiv>
                    <Label htmlFor="역할코드">역할코드</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="역할코드" name="role_code" value={RoleDetail.role_code} onChange={handleInputChange}/>
                </FormItem>
                <FormItem key="2">
                  <LabelDiv>
                    <Label htmlFor="역할명">역할명</Label>
                    <Required>*</Required>
                  </LabelDiv>
                  <Input type="text" id="역할명" name="role_name" value={RoleDetail.role_name} onChange={handleInputChange}/>
                </FormItem>
                <FormItem key="3">
                  <LabelDiv>
                    <Label htmlFor="메타사용여부">메타사용여부</Label>
                  </LabelDiv>
                    <Input type="checkbox" id="메타사용여부" name="meta_use_yn" value={RoleDetail.meta_use_yn} />
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
          <h2>역할 삭제</h2>
          "{RoleDetail.role_code}" "{RoleDetail.role_name}" 역할을 삭제하시겠습니까?
          <ButtonContainer>
            <Button primary onClick={handleDelete}>삭제</Button>
            <Button onClick={deleteModalClose}>닫기</Button>
          </ButtonContainer>
        </div>
      </Modal>





    </div>
    
  );
}

export default RoleManagement;