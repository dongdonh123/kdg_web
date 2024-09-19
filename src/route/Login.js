import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GridContainer, FormItem, Label, Input, ButtonContainer, InsertModalStyles, Required, LabelDiv } from '../css/componunt/Modalcss';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // 로그인 요청 예시 (서버에서 JWT 토큰을 발급받는 로직)
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('jwtToken', data.token); // 토큰 저장
      navigate('/'); // 메인 페이지로 리다이렉트
    } else {
      alert('로그인 실패');
    }
  };

  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const insertModalClose = () => setInsertModalOpen(false);
  const insertModalShow = () => setInsertModalOpen(true);

  //신규등록 api 호출부분 
  const handleLogin = async (event) => {
    event.preventDefault();

    const roleCode = event.target.role_code.value.trim();
    const roleName = event.target.role_name.value.trim();
    if (!roleCode) {
      alert('역할코드는 필수값입니다.')
      return;
    }

    if (!roleName) {
      alert('역할명은 필수값입니다.');
      return;
    }
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await axios.post('http://localhost:8080/api/login/setpasswd', data);
      alert(response.data.resultmessage);
      insertModalClose();
    } catch (error) {
      console.error('패스워드 설정중 오류 발생:', error);
      alert('서버 오류로 인해 패스워드 설정을 실패했습니다.');
    }
  };


  return (
    <div>
      <h2>로그인 페이지</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>비밀번호:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button primary type="submit">로그인</Button>
        <Button onClick={insertModalShow}>신규</Button>
      </form>

      {/* 신규등록 모달창 */}
      <Modal isOpen={insertModalOpen} 
             onRequestClose={insertModalClose} 
             style={InsertModalStyles} 
             ariaHideApp={false} 
             contentLabel="Pop up Message" 
             shouldCloseOnOverlayClick={false}
      >
        <div>
          <h2>패스워드 설정 셋팅</h2>
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
            </GridContainer>
            <ButtonContainer>
              <Button primary type="submit">등록</Button>
              <Button onClick={insertModalClose}>닫기</Button>
            </ButtonContainer>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default Login;