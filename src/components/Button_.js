import React from 'react';
import '../css/Button.css';

const Button = ({ primary, children, ...props }) => {
  return (
    <button
      className={`button ${primary ? 'button-primary' : 'button-secondary'}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;