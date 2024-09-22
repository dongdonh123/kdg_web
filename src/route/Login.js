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
    e.preventDefault(); // 기본 제출 동작 방지

    if (!username) {
      alert('ID를 입력해주세요')
      return;
    }

    if (!password) {
      alert('PASSWD를 입력해주세요');
      return;
    }


    const formData = new FormData(e.target);
    formData.set('username', username); 
    formData.set('password', password);

    try {
      alert(JSON.stringify(Object.fromEntries(formData.entries()), null, 2)); // JSON 형식으로 문자열화하여 알림창에 표시
      const response = await axios.post('http://localhost:8080/login', formData);
      console.log('Server response:', response); // 응답 확인
      
      // Authorization 헤더에서 토큰 추출
      const token = response.headers['authorization']; // 'Bearer eyJ...' 형태

      if (token) {
        const jwt = token.split(' ')[1]; // 'Bearer ' 제거하고 JWT만 가져오기
        localStorage.setItem('jwtToken', jwt); // JWT 토큰 저장
        alert('로그인 성공!'); // 성공 메시지
        navigate('/'); // 메인 페이지로 리다이렉트
      } else {
        alert('로그인 실패: 토큰이 없습니다.');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      alert('로그인 실패: ' + error.response?.data || '서버 오류');
    }
  };

  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const insertModalClose = () => setInsertModalOpen(false);
  const insertModalShow = () => setInsertModalOpen(true);



  return (
    <div>
      <h2>로그인 페이지</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디:</label>
          <input type="text" value={username} onChange={(e) => {
  setUsername(e.target.value);
}} />
        </div>
        <div>
          <label>비밀번호:</label>
          <input type="password" value={password} onChange={(e) => {
  setPassword(e.target.value);
}} />
        </div>
        <Button type="submit">로그인</Button>
      </form>

      {/* 신규등록 모달창 */}
      {/* <Modal isOpen={insertModalOpen} 
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
      </Modal> */}
    </div>
  );
}

export default Login;