import "../css/componunt/Header.css";
import React, { useState } from "react";
import {
  PasswordGridContainer,
  FormItem,
  Label,
  Input,
  ButtonContainer,
  PasswordResetModalStyles,
  Required,
  PasswordLabelDiv,
} from "../css/componunt/Modalcss";
import Modal from "react-modal";
import { Button } from "react-bootstrap";

function Header() {
  //모달 처리 변수들
  const [userModalOpen, setUserModalOpen] = useState(false);
  const userModalClose = () => setUserModalOpen(false);
  const userModalShow = () => setUserModalOpen(true);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // localStorage에서 'jwt' 항목 삭제
    localStorage.removeItem("KDH_JWT_TOKEN");

    // 로그아웃 후 원하는 페이지로 리디렉션
    window.location.href = "/"; // 또는 사용자의 필요에 따라 다른 페이지로 이동
  };

  return (
    <div className="HeaderMain">
      <div className="left">
        <img
          className="hover-image"
          src="/images/link.svg"
          style={{ width: "30px", height: "30px", marginLeft: "20px" }}
        />
        2 로고
      </div>
      <div className="right">
        <div>
          <span
            style={{
              position: "absolute",
              pointerEvents: "none",
              padding: "6px",
            }}
          >
            <img
              src="/images/search.svg"
              style={{ width: "20px", height: "20px", marginLeft: "10px" }}
            />
          </span>

          <input
            type="text"
            placeholder="검색어를 입력하세요"
            style={{
              width: "300px",
              height: "40px",
              borderRadius: "5px",
              paddingLeft: "40px",
              fontSize: "13px",
            }}
          ></input>
        </div>
        <img
          className="hover-image"
          src="/images/home.svg"
          style={{ width: "30px", height: "30px", marginLeft: "20px" }}
        />
        <img
          className="hover-image"
          src="/images/user_black.svg"
          style={{ width: "30px", height: "30px", marginLeft: "20px" }}
        />
        <img
          className="hover-image"
          src="/images/logout.svg"
          style={{ width: "30px", height: "30px", marginLeft: "20px" }}
          onClick={handleLogout} // 클릭 시 로그아웃 처리 함수 실행
        />
      </div>

      {/* 유저정보 모달창 */}
      <Modal
        isOpen={userModalOpen}
        onRequestClose={userModalClose}
        style={PasswordResetModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2 style={{ backgroundColor: "#287eff", color: "white" }}>
            사용자 정보
          </h2>
          <form onSubmit={null}>
            <PasswordGridContainer>
              <FormItem key="1">
                <PasswordLabelDiv>
                  <Label htmlFor="사용자ID">사용자ID</Label>
                </PasswordLabelDiv>
                <Input type="text" id="사용자ID" name="username" disabled />
              </FormItem>
              <FormItem key="2">
                <PasswordLabelDiv>
                  <Label htmlFor="비밀번호">비밀번호</Label>
                  <Required>*</Required>
                </PasswordLabelDiv>
                <Input type="password" id="비밀번호" name="password" />
              </FormItem>
              <FormItem key="3">
                <PasswordLabelDiv>
                  <Label htmlFor="비밀번호확인">비밀번호확인</Label>
                  <Required>*</Required>
                </PasswordLabelDiv>
                <Input
                  type="password"
                  id="비밀번호확인"
                  name="confirmPassword"
                />
              </FormItem>
            </PasswordGridContainer>
            <ButtonContainer>
              <Button primary type="submit">
                확인
              </Button>
              <Button onClick={userModalClose}>취소</Button>
            </ButtonContainer>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Header;
