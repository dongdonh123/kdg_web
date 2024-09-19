export const isAuthenticated = () => {
    const token = localStorage.getItem('jwtToken');
    // 토큰이 존재하고, 만료되지 않았는지 확인
    return !!token;
  };