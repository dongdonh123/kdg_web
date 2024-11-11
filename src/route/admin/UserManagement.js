import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "../../css/content-ctn2.css";
import Resizer from "../../components/ResizerRow"; // Resizer 컴포넌트 가져오기
import Pagination from "../../components/Pagination";
import "../../css/mainTable/UserManagement.css";
import UserDetailTable from "../../detailtap/UserDetailTable";
import RoleListTable from "../../detailtap/RoleListTable.js";

import {
  GridContainer,
  FormItem,
  Label,
  Input,
  ButtonContainer,
  InsertModalStyles,
  DeleteModalStyles,
  Required,
  LabelDiv,
  Select,
} from "../../css/componunt/Modalcss.js";
import Modal from "react-modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function UserManagement() {
  // 모달처리 시작
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwdInitModalOpen, setPasswdInitModalOpen] = useState(false);
  const [useynModalOpen, setUseynModalOpen] = useState(false);

  const insertModalShow = () => setInsertModalOpen(true);
  const insertModalClose = () => setInsertModalOpen(false);
  const updateModalShow = (user_id) => {
    if (user_id == "-") {
      alert("수정하려는 사용자를 선택해주세요.");
      return;
    }
    setUpdateModalOpen(true);
  };
  const updateModalClose = () => setUpdateModalOpen(false);
  const deleteModalShow = (user_id) => {
    if (user_id == "-") {
      alert("삭제하려는 사용자를 선택해주세요."); // 알럿을 띄움
      return; // 함수 종료
    }
    setDeleteModalOpen(true);
  };
  const deleteModalClose = () => setDeleteModalOpen(false);

  const passwdInitModalShow = (user_id) => {
    if (user_id == "-") {
      alert("사용자를 선택해주세요."); // 알럿을 띄움
      return; // 함수 종료
    }
    setPasswdInitModalOpen(true);
  };
  const passwdInitModalClose = () => setPasswdInitModalOpen(false);

  const useynyModalShow = (user_id, user_use_yn) => {
    if (user_id == "-") {
      alert("사용자를 선택해주세요."); // 알럿을 띄움
      return; // 함수 종료
    }
    if (user_use_yn == "Y") {
      alert("이미 사용여부 Y입니다."); // 알럿을 띄움
      return; // 함수 종료
    }
    setUseynModalOpen(true);
  };

  const useynnModalShow = (user_id, user_use_yn) => {
    if (user_id == "-") {
      alert("사용자를 선택해주세요."); // 알럿을 띄움
      return; // 함수 종료
    }
    if (user_use_yn == "N") {
      alert("이미 사용여부 N입니다"); // 알럿을 띄움
      return; // 함수 종료
    }
    setUseynModalOpen(true);
  };
  const useynModalClose = () => setUseynModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetail({
      ...UserDetail,
      [name]: value,
    });
  };

  //신규등록 api 호출부분
  const handleInsert = async (event) => {
    event.preventDefault();

    const userName = event.target.user_name.value.trim();
    const userAccountId = event.target.user_account_id.value.trim();
    const user_use_yn = event.target.user_use_yn.checked ? "Y" : "N"; //체크박스의 체크 여부 확인
    if (!userName) {
      alert("사용자명은 필수값입니다.");
      return;
    }

    if (!userAccountId) {
      alert("사용자ID는 필수값입니다.");
      return;
    }

    // 현재 체크된 체크박스의 ID를 수집
    const currentSelectedRoles = Array.from(
      document.querySelectorAll(
        'input.insertrolecheckbox[type="checkbox"]:checked'
      )
    ).map((checkbox) => Number(checkbox.value));

    // 데이터 객체 생성
    const data = {
      user_name: userName,
      user_account_id: userAccountId,
      user_use_yn: user_use_yn,
      user_category: event.target.user_category.value,
      user_department: event.target.user_department.value,
      user_phon_no: event.target.user_phon_no.value,
      user_email: event.target.user_email.value,
      rel_user_roleID: currentSelectedRoles, // 배열 형식으로 전송
    };
    try {
      alert(JSON.stringify(data, null, 2)); // 2는 들여쓰기의 공백 수
      const response = await axios.post(
        "http://localhost:8080/api/admin/user",
        data
      );
      alert(response.data.resultmessage);
      insertModalClose();
      fetchUserList(currentPage, itemsPerPage, filterList); // 데이터 갱신
    } catch (error) {
      console.error("사용자 신규 등록 중 오류 발생:", error);
      alert("서버 오류로 인해 사용자 신규 등록을 실패했습니다.");
    }
  };

  //수정등록 api 호출부분
  const handleUpdate = async (event) => {
    event.preventDefault();

    // 현재 체크된 체크박스의 ID를 수집
    const currentSelectedRoles = Array.from(
      document.querySelectorAll(
        'input.updaterolecheckbox[type="checkbox"]:checked'
      )
    ).map((checkbox) => Number(checkbox.value));

    // 사용여부 체크박스 수집
    const user_use_yn = event.target.user_use_yn.checked ? "Y" : "N"; //체크박스의 체크 여부 확인

    // 데이터 객체 생성
    const data = {
      user_name: event.target.user_name.value,
      user_account_id: event.target.user_account_id.value,
      user_use_yn: user_use_yn,
      user_category: event.target.user_category.value,
      user_department: event.target.user_department.value,
      user_phon_no: event.target.user_phon_no.value,
      user_email: event.target.user_email.value,
      rel_user_roleID: currentSelectedRoles, // 배열 형식으로 전송
    };

    try {
      alert(JSON.stringify(data, null, 2)); // 2는 들여쓰기의 공백 수
      const response = await axios.put(
        `http://localhost:8080/api/admin/user/${UserDetail.user_id}`,
        data
      );
      alert(response.data.resultmessage);
      updateModalClose();
      fetchUserList(currentPage, itemsPerPage, filterList);
      fetchUserDetail();
    } catch (error) {
      console.error("사용자 수정 등록 중 오류 발생:", error);
      alert("서버 오류로 인해 사용자 수정 등록을 실패했습니다.");
    }
  };

  //삭제 api 호출 부분
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/admin/user/${UserDetail.user_id}`
      );
      alert(response.data.resultmessage);
      fetchUserList(currentPage, itemsPerPage, filterList);
      fetchUserDetail(); // 데이터 갱신
      deleteModalClose();
    } catch (error) {
      console.error("사용자 삭제 중 오류 발생:", error);
      alert("서버 오류로 인해 사용자 삭제를 실패했습니다.");
    }
  };

  //패스워드초기화 api 호출 부분
  const handlePasswdInit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/admin/user/passwdinit/${UserDetail.user_id}`
      );
      alert(response.data.resultmessage);
      fetchUserList(currentPage, itemsPerPage, filterList); // 데이터 갱신
      fetchUserDetail();
      passwdInitModalClose();
    } catch (error) {
      console.error("사용자 삭제 중 오류 발생:", error);
      alert("서버 오류로 인해 패스워드 초기화를 실패했습니다.");
    }
  };

  //사용여부변경 api 호출 부분
  const handleUseyn = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/admin/user/useyn/${UserDetail.user_id}`
      );
      alert(response.data.resultmessage);
      fetchUserList(currentPage, itemsPerPage, filterList); // 데이터 갱신
      fetchUserDetail();
      useynModalClose();
    } catch (error) {
      console.error("사용자 삭제 중 오류 발생:", error);
      alert("서버 오류로 인해 사용여부 변경을 실패했습니다.");
    }
  };

  // 모달처리 끝

  const containerRef = useRef(null);
  const topDivRef = useRef(null);
  const bottomDivRef = useRef(null);

  const [userList, setUserList] = useState([]);
  const [otherInformation, setOtherInformation] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [user_id, setUser_id] = useState("");

  const [filterList, setFilterList] = useState({
    user_name: "",
    user_account_id: "",
  });
  const [UserDetail, setUserDetail] = useState({
    //오른쪽 메뉴정보 데이터
    user_id: "-",
    user_name: "-",
    user_account_id: "-",
    user_passwd: "-",
    user_passwd_fail_cnt: "-",
    user_use_yn: "-",
    user_category: "-",
    user_department: "-",
    user_phon_no: "-",
    user_email: "-",
    create_dt: "-",
    create_user: "-",
    modify_dt: "-",
    modify_user: "-",
  });

  const [roleList, setRoleList] = useState([]);
  const [relUserRoleList, setRelUserRoleList] = useState([]);

  // 메인테이블 선택시 배경색 바꾸고 id 선택하기
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (index, user_id) => {
    setUser_id(user_id);
    setSelectedRow(index);
  };

  //메뉴id가 변경될때마다 오른쪽 상세정보 데이터 가져오기
  useEffect(() => {
    fetchUserDetail();
  }, [user_id]);

  //메인 리스트 가져오기
  const fetchUserList = async (page_no, page_cnt, filterList) => {
    try {
      // 기본 URL 설정
      let url = `http://localhost:8080/api/admin/user?page_no=${page_no}&page_cnt=${page_cnt}`;

      if (
        filterList.user_name !== undefined &&
        filterList.user_name !== null &&
        filterList.user_name.trim() !== ""
      ) {
        url += `&user_name=${encodeURIComponent(filterList.user_name)}`;
      }
      if (
        filterList.user_account_id !== undefined &&
        filterList.user_account_id !== null &&
        filterList.user_account_id.trim() !== ""
      ) {
        url += `&user_account_id=${encodeURIComponent(
          filterList.user_account_id
        )}`;
      }
      const response = await axios.get(url);
      setUserList(response.data.userList);
      setOtherInformation(response.data.otherInformation);
      setIsFirstLoad(false);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  //하단 상세정보 api로 가져오는 부분
  const fetchUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/user/${user_id}`
      );
      setUserDetail(response.data.userDetail);
      setRelUserRoleList(response.data.relUserRoleList);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  useEffect(() => {
    if (isFirstLoad) {
      return;
    }
    fetchUserList(currentPage, itemsPerPage, filterList);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if ((newPage > 0 && newPage <= otherInformation.max_page_no) || 1) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    fetchUserList(currentPage, itemsPerPage, filterList);
  };

  //역할 리스트 가져오기
  const fetchRoleList = async () => {
    try {
      // 기본 URL 설정
      let url = `http://localhost:8080/api/admin/role`;
      const response = await axios.get(url);
      setRoleList(response.data.roleList);
    } catch (error) {
      console.error("Error fetching role list:", error);
    }
  };

  useEffect(() => {
    fetchRoleList();
  }, []);

  const handleUserNameChange = (e) => {
    setFilterList((prevState) => ({ ...prevState, user_name: e.target.value }));
  };

  const handleUserAccountIdChange = (e) => {
    setFilterList((prevState) => ({
      ...prevState,
      user_account_id: e.target.value,
    }));
  };

  const isRoleChecked = (roleId) => {
    return relUserRoleList.some((item) => item.role_id === roleId);
  };

  return (
    <div>
      <div className="content_container-ctn2" ref={containerRef}>
        <div className="title-ctn2">
          <div>사용자관리</div>
        </div>
        <div className="cud_button-ctn2">
          <Button primary onClick={insertModalShow}>
            신규
          </Button>
          <Button primary onClick={() => updateModalShow(UserDetail.user_id)}>
            수정
          </Button>
          <Button primary onClick={() => deleteModalShow(UserDetail.user_id)}>
            삭제
          </Button>
          <Button
            primary
            onClick={() => passwdInitModalShow(UserDetail.user_id)}
          >
            비밀번호초기화
          </Button>
          <Button
            primary
            onClick={() =>
              useynyModalShow(UserDetail.user_id, UserDetail.user_use_yn)
            }
          >
            사용
          </Button>
          <Button
            primary
            onClick={() =>
              useynnModalShow(UserDetail.user_id, UserDetail.user_use_yn)
            }
          >
            사용정지
          </Button>
        </div>
        <div className="read_button-ctn2" id="검색조건">
          <div id="left">
            사용자명 :{" "}
            <input
              type="text"
              placeholder="사용자명 검색"
              onChange={handleUserNameChange}
            />
            사용자ID :{" "}
            <input
              type="text"
              placeholder="사용자ID 검색"
              onChange={handleUserAccountIdChange}
            />
          </div>
          <div id="right">
            <Button onClick={handleSearch}>검색</Button>
          </div>
        </div>
        <div className="maincontent-ctn2" id="메인그리드">
          <table className="MainTable">
            <thead className="TableHeader">
              <tr>
                <th className="col1">번호</th>
                <th className="col2">사용자명</th>
                <th className="col3">사용자ID</th>
                <th className="col4">사용여부</th>
                <th className="col5">사용자구분</th>
                <th className="col6">비밀번호오류횟수</th>
                <th className="col7">최초등록자</th>
                <th className="col8">최초등록일시</th>
                <th className="col9">최종변경자</th>
                <th className="col10">최종변경일시</th>
              </tr>
            </thead>
            <tbody className="TableBody-ctn2" id="TableBody" ref={topDivRef}>
              {userList.map((user, index) => (
                <tr
                  key={user.user_id}
                  onClick={() => handleRowClick(index, user.user_id)}
                  className={selectedRow === index ? "selected" : ""}
                >
                  <td className="col1">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>{" "}
                  {/* 1부터 시작하는 화면 번호 */}
                  <td className="col2">{user.user_name}</td>
                  <td className="col3">{user.user_account_id}</td>
                  <td className="col4">{user.user_use_yn}</td>
                  <td className="col5">{user.user_category}</td>
                  <td className="col6">{user.user_passwd_fail_cnt}</td>
                  <td className="col7">{user.create_user}</td>
                  <td className="col8">
                    {new Date(user.create_dt).toLocaleString()}
                  </td>
                  <td className="col9">{user.modify_user}</td>
                  <td className="col10">
                    {user.modify_dt
                      ? new Date(user.modify_dt).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={otherInformation.max_page_no || 1}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={otherInformation}
          isFirstLoad={isFirstLoad}
        />
        <Resizer
          containerRef={containerRef}
          topDivRef={topDivRef}
          bottomDivRef={bottomDivRef}
        />
        <div className="detailstap-ctn2" ref={bottomDivRef}>
          <Tabs
            defaultActiveKey="상세정보"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="상세정보" title="상세정보">
              <UserDetailTable UserDetail={UserDetail} />
            </Tab>
            <Tab eventKey="역할목록" title="역할목록">
              <RoleListTable
                roleList={roleList}
                relUserRoleList={relUserRoleList}
              />
            </Tab>
          </Tabs>
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
          <h2>사용자 신규 등록</h2>
          <form onSubmit={handleInsert}>
            <GridContainer>
              <FormItem key="1">
                <LabelDiv>
                  <Label htmlFor="사용자코드">사용자명</Label>
                  <Required>*</Required>
                </LabelDiv>
                <Input type="text" id="사용자명" name="user_name" />
              </FormItem>
              <FormItem key="2">
                <LabelDiv>
                  <Label htmlFor="사용자ID">사용자ID</Label>
                  <Required>*</Required>
                </LabelDiv>
                <Input type="text" id="사용자ID" name="user_account_id" />
              </FormItem>
              <FormItem key="3">
                <LabelDiv>
                  <Label htmlFor="사용여부">사용여부</Label>
                </LabelDiv>
                <Input
                  type="checkbox"
                  id="사용여부"
                  name="user_use_yn"
                  defaultChecked
                />
              </FormItem>
              <FormItem key="4">
                <LabelDiv>
                  <Label htmlFor="사용자구분">사용자구분</Label>
                </LabelDiv>
                <Select
                  id="사용자구분"
                  name="user_category"
                  defaultValue="정규"
                >
                  <option value="정규">정규</option>
                  <option value="임시">임시</option>
                </Select>
              </FormItem>
              <FormItem key="5">
                <LabelDiv>
                  <Label htmlFor="부서">부서</Label>
                </LabelDiv>
                <Input type="text" id="부서" name="user_department" />
              </FormItem>
              <FormItem key="6">
                <LabelDiv>
                  <Label htmlFor="핸드폰">핸드폰</Label>
                </LabelDiv>
                <Input type="text" id="핸드폰" name="user_phon_no" />
              </FormItem>
              <FormItem key="7">
                <LabelDiv>
                  <Label htmlFor="이메일">이메일</Label>
                </LabelDiv>
                <Input type="text" id="이메일" name="user_email" />
              </FormItem>
            </GridContainer>
            <table className="MainTable">
              <thead className="TableHeader">
                <tr>
                  <th className="col1"></th>
                  <th className="col2">역할코드</th>
                  <th className="col3">역할명</th>
                </tr>
              </thead>
              <tbody className="TableBody-ctn2">
                {roleList.map((role) => (
                  <tr key={role.role_id}>
                    <td className="col1">
                      <input
                        className="insertrolecheckbox"
                        type="checkbox"
                        value={role.role_id}
                      />
                    </td>
                    <td className="col2">{role.role_code}</td>
                    <td className="col3">{role.role_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ButtonContainer>
              <Button primary type="submit">
                등록
              </Button>
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
          <h2>사용자 수정 등록</h2>
          <form onSubmit={handleUpdate}>
            <GridContainer>
              <FormItem key="1">
                <LabelDiv>
                  <Label htmlFor="사용자코드">사용자명</Label>
                  <Required>*</Required>
                </LabelDiv>
                <Input
                  type="text"
                  id="사용자명"
                  name="user_name"
                  disabled
                  value={UserDetail.user_name}
                />
              </FormItem>
              <FormItem key="2">
                <LabelDiv>
                  <Label htmlFor="사용자ID">사용자ID</Label>
                  <Required>*</Required>
                </LabelDiv>
                <Input
                  type="text"
                  id="사용자ID"
                  name="user_account_id"
                  disabled
                  value={UserDetail.user_account_id}
                />
              </FormItem>
              <FormItem key="3">
                <LabelDiv>
                  <Label htmlFor="사용여부">사용여부</Label>
                </LabelDiv>
                <Input
                  type="checkbox"
                  id="사용여부"
                  name="user_use_yn"
                  defaultChecked={UserDetail.user_use_yn === "Y"}
                />
              </FormItem>
              <FormItem key="4">
                <LabelDiv>
                  <Label htmlFor="사용자구분">사용자구분</Label>
                </LabelDiv>
                <Select
                  id="사용자구분"
                  name="user_category"
                  defaultValue={UserDetail.user_category}
                >
                  <option value="정규">정규</option>
                  <option value="임시">임시</option>
                </Select>
              </FormItem>
              <FormItem key="5">
                <LabelDiv>
                  <Label htmlFor="부서">부서</Label>
                </LabelDiv>
                <Input
                  type="text"
                  id="부서"
                  name="user_department"
                  value={UserDetail.user_department}
                  onChange={handleInputChange}
                />
              </FormItem>
              <FormItem key="6">
                <LabelDiv>
                  <Label htmlFor="핸드폰">핸드폰</Label>
                </LabelDiv>
                <Input
                  type="text"
                  id="핸드폰"
                  name="user_phon_no"
                  value={UserDetail.user_phon_no}
                  onChange={handleInputChange}
                />
              </FormItem>
              <FormItem key="7">
                <LabelDiv>
                  <Label htmlFor="이메일">이메일</Label>
                </LabelDiv>
                <Input
                  type="text"
                  id="이메일"
                  name="user_email"
                  value={UserDetail.user_email}
                  onChange={handleInputChange}
                />
              </FormItem>
            </GridContainer>
            <table className="MainTable">
              <thead className="TableHeader">
                <tr>
                  <th className="col1"></th>
                  <th className="col2">역할코드</th>
                  <th className="col3">역할명</th>
                </tr>
              </thead>
              <tbody className="TableBody-ctn2">
                {roleList.map((role) => (
                  <tr key={role.role_id}>
                    <td className="col1">
                      <input
                        className="updaterolecheckbox"
                        type="checkbox"
                        value={role.role_id}
                        defaultChecked={isRoleChecked(role.role_id)}
                      />
                    </td>
                    <td className="col2">{role.role_code}</td>
                    <td className="col3">{role.role_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ButtonContainer>
              <Button primary type="submit">
                수정
              </Button>
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
          <h2>사용자 삭제</h2>"{UserDetail.user_name}" "
          {UserDetail.user_account_id}" 사용자을 삭제하시겠습니까?
          <ButtonContainer>
            <Button primary onClick={handleDelete}>
              삭제
            </Button>
            <Button onClick={deleteModalClose}>닫기</Button>
          </ButtonContainer>
        </div>
      </Modal>

      {/* 비밀번호초기화 모달창 */}
      <Modal
        isOpen={passwdInitModalOpen}
        onRequestClose={passwdInitModalClose}
        style={DeleteModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>사용자 비밀번호 초기화</h2>"{UserDetail.user_name}" "
          {UserDetail.user_account_id}" 사용자의 비밀번호를 초기화하시겠습니까?
          <ButtonContainer>
            <Button primary onClick={handlePasswdInit}>
              확인
            </Button>
            <Button onClick={passwdInitModalClose}>닫기</Button>
          </ButtonContainer>
        </div>
      </Modal>

      {/* 사용yn 모달창 */}
      <Modal
        isOpen={useynModalOpen}
        onRequestClose={useynModalClose}
        style={DeleteModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>사용여부 변경</h2>"{UserDetail.user_name}" "
          {UserDetail.user_account_id}" 사용여부를 변경하시겠습니까?
          <ButtonContainer>
            <Button primary onClick={handleUseyn}>
              확인
            </Button>
            <Button onClick={useynModalClose}>닫기</Button>
          </ButtonContainer>
        </div>
      </Modal>
    </div>
  );
}

export default UserManagement;
