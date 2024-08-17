// styles.js
import styled from 'styled-components';

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const FormItem = styled.div`
  display: flex;
  flex-direction: center; //수직 정렬
  margin-bottom: 10px;
`;

export const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  //width: 100px;
  //margin-right: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

export const InsertModalStyles = {
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

export const DeleteModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '8px',
      width: '600px',
    },
  };

export const Required = styled.span`
  color: red;
  margin-right: 10px;
`;

export const LabelDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100px;  // 가로로 넓이를 100%로 설정
`;