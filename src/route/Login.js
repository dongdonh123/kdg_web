import "../css/font/font.css";
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
import axios from "axios";

function Login() {
  const [user_id, setUser_id] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginfailmassage, SetLoginfailmassage] = useState(
    "게스트 로그인해서 웹사이트를 구경하세요."
  );

  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 제출 동작 방지

    if (!username) {
      alert("ID를 입력해주세요");
      return;
    }

    if (!password) {
      alert("PASSWD를 입력해주세요");
      return;
    }

    const formData = new FormData(e.target);
    formData.set("username", username);
    formData.set("password", password);

    try {
      // alert(JSON.stringify(Object.fromEntries(formData.entries()), null, 2)); // JSON 형식으로 문자열화하여 알림창에 표시
      const response = await axios.post(
        "http://localhost:8080/login",
        formData
      );
      console.log("Server response:", response); // 응답 확인

      // Authorization 헤더에서 토큰 추출
      const token = response.headers["authorization"]; // 'Bearer eyJ...' 형태

      if (token) {
        localStorage.setItem("KDH_JWT_TOKEN", token); // JWT 토큰 저장
        window.location.href = "/"; // / 경로로 리다이렉트
      } else {
        alert("로그인 실패: 토큰이 없습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);

      // 서버에서 보내는 Id가 있을경우 초기화
      if (error.response?.data?.user_id) {
        setUser_id(error.response?.data?.user_id);
      }

      // 서버에서 보내는 오류 메시지가 있는 경우 표시
      if (error.response?.data?.message) {
        if (
          error.response.data.message ==
          "패스워드가 설정되지 않았습니다. password 설정이 필요합니다."
        ) {
          passwordModalShow();
          alert("패스워드를 설정해주세요"); // 패스워드 설정 모달 만들기
          return 0;
        }

        alert("로그인 실패: " + error.response.data.message);
        SetLoginfailmassage(error.response.data.message);
      } else {
        console.log("Error response data:", error);
        alert("서버 오류. 관리자에게 문의하세요.");
        SetLoginfailmassage("서버 오류. 관리자에게 문의하세요.");
      }
    }
  };

  //   //패스워드재설정 api 호출부분
  const resetPassword = async (event) => {
    event.preventDefault();
    const password = event.target.password.value.trim();
    const confirmPassword = event.target.confirmPassword.value.trim();
    if (!password) {
      alert("비밀번호는 필수값입니다.");
      return;
    }
    if (!confirmPassword) {
      alert("비밀번호확인은 필수값입니다.");
      return;
    }
    if (password != confirmPassword) {
      alert("입력된 비밀번호가 서로 일치하지 않습니다");
      return;
    }
    // 데이터 객체 생성
    const data = {
      user_account_id: username,
      user_passwd: password, // 배열 형식으로 전송
    };
    try {
      // alert(JSON.stringify(data, null, 2)); // 2는 들여쓰기의 공백 수
      const response = await axios.put(
        `http://localhost:8080/api/admin/user/changepassword/${user_id}`,
        data
      );
      alert(response.data.resultmessage);
      passwordModalClose();
      setPassword(""); // 패스워드입력 지우기
      SetLoginfailmassage(response.data.resultmessage);
    } catch (error) {
      SetLoginfailmassage("서버 오류로 인해 패스워드 재설정을 실패했습니다.");
      alert("서버 오류로 인해 패스워드 재설정을 실패했습니다.");
    }
  };

  const [changePassword, setChangePassword] = useState("");
  const [changePasswordCheck, setChangePasswordCheck] = useState("");

  // 비밀번호 길이를 체크하는 함수 -
  const handlePasswordChange = (e, gubun) => {
    const Password = e.target.value;
    const confirmPassword = e.target.value;

    if (gubun == "password") {
      if (Password.length > 20) {
        alert("비밀번호는 20자리를 초과할 수 없습니다.");
        setChangePassword(""); // 20자리로 제한
      } else {
        setChangePassword(Password);
      }
    } else if (gubun == "confirmPassword") {
      if (confirmPassword.length > 20) {
        alert("비밀번호는 20자리를 초과할 수 없습니다.");
        setChangePasswordCheck(""); // 20자리로 제한
      } else {
        setChangePasswordCheck(confirmPassword);
      }
    }
  };

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const passwordModalClose = () => setPasswordModalOpen(false);
  const passwordModalShow = () => setPasswordModalOpen(true);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#0B6121",
          width: "100%",
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            width: "700px",
            height: "350px",
            marginLeft: "10%",
            marginBottom: "8%",
            padding: "20px",
            borderRadius: "10px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          <h2 style={{ margin: "0 0 10px", fontSize: "40px" }}>
            김동환 데이터거버넌스 프로젝트
          </h2>
          <p style={{ margin: "0 0 10px" }}>2024.06~</p>
          <h3 style={{ margin: "0 0 10px", fontSize: "22px" }}>
            Welcome to the KDG project website
          </h3>
          <p style={{ margin: "0 0 22px", fontSize: "22px" }}>
            This is a data management platform featuring metadata management,
            data quality management, business metadata management, impact
            analysis, and data search functionalities. You can search,
            understand, and manage all your data assets, control access, build
            your data team, and ensure governance.
          </p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            width: "500px",
            height: "300px",
            marginRight: "10%",
            marginBottom: "8%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "15px",
          }}
        >
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "-7%",
            }}
          >
            <div style={{ paddingBottom: "10px" }}>
              <span
                style={{
                  position: "absolute",
                  pointerEvents: "none",
                  padding: "8px",
                }}
              >
                <img
                  src="/images/user.svg"
                  alt="user icon"
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
              <input
                style={{
                  borderRadius: "5px",
                  width: "350px",
                  height: "40px",
                  paddingLeft: "40px",
                }}
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder=" 사용자ID"
              />
            </div>
            <div style={{ paddingBottom: "5px" }}>
              <span
                style={{
                  position: "absolute",
                  pointerEvenNts: "none",
                  padding: "8px",
                }}
              >
                <img
                  src="/images/key.svg"
                  alt="user icon"
                  style={{ width: "20px", height: "20px" }}
                />
              </span>
              <input
                style={{
                  borderRadius: "5px",
                  width: "350px",
                  height: "40px",
                  paddingLeft: "40px",
                }}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder=" 비밀번호"
              />
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                paddingBottom: "15px",
              }}
            >
              <input
                style={{ width: "20px", height: "20px" }}
                type="checkbox"
              ></input>
              <p style={{ display: "inline", paddingLeft: "5px", margin: "0" }}>
                {" "}
                Remember ID
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              <Button style={{ width: "49%" }} type="submit">
                일반 로그인
              </Button>
              <Button
                style={{
                  width: "49%",
                  backgroundColor: "#424242",
                  borderColor: "#424242",
                }}
                type="submit"
              >
                게스트 로그인
              </Button>
            </div>
            <div
              style={{
                width: "350px",
                color: "red",
                maxHeight: "50px",
                overflowY: "auto",
                wordWrap: "break-word",
                fontSize: "14px",
              }}
            >
              <p>{loginfailmassage}</p>
            </div>
          </form>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#0B6121",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingBottom: "5px",
        }}
      >
        <p style={{ paddingLeft: "60px" }}>
          2024 데이터스트림즈 김동환 donghwan.kim@datastreams.co.kr
        </p>{" "}
        <a
          href="https://github.com/dongdonh123/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/github.svg"
            style={{ width: "28px", height: "28px", marginLeft: "20px" }}
          />
        </a>{" "}
        <a
          href="https://kimdonghwanta.tistory.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/blog.png"
            style={{ width: "28px", height: "28px", marginLeft: "20px" }}
          />
        </a>
      </div>

      {/* 패스워드설정 모달창 */}
      <Modal
        isOpen={passwordModalOpen}
        onRequestClose={passwordModalClose}
        style={PasswordResetModalStyles}
        ariaHideApp={false}
        contentLabel="Pop up Message"
        shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2 style={{ backgroundColor: "#287eff", color: "white" }}>
            암호 변경
          </h2>
          <form onSubmit={resetPassword}>
            <PasswordGridContainer>
              <FormItem key="1">
                <PasswordLabelDiv>
                  <Label htmlFor="사용자ID">사용자ID</Label>
                </PasswordLabelDiv>
                <Input
                  type="text"
                  id="사용자ID"
                  name="username"
                  disabled
                  value={username}
                />
              </FormItem>
              <FormItem key="2">
                <PasswordLabelDiv>
                  <Label htmlFor="비밀번호">비밀번호</Label>
                  <Required>*</Required>
                </PasswordLabelDiv>
                <Input
                  type="password"
                  id="비밀번호"
                  name="password"
                  onChange={(e) => handlePasswordChange(e, "password")}
                  value={changePassword}
                />
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
                  onChange={(e) => handlePasswordChange(e, "confirmPassword")}
                  value={changePasswordCheck}
                />
              </FormItem>
            </PasswordGridContainer>
            <ButtonContainer>
              <Button primary type="submit">
                확인
              </Button>
              <Button onClick={passwordModalClose}>취소</Button>
            </ButtonContainer>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Login;
