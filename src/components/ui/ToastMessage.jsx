import { useState, useEffect } from 'react';
import styled from 'styled-components';

const ToastWrap = styled.div`
  opacity: ${({ show }) => (show ? 1 : 0)};
  position: fixed;
  bottom: ${({ show }) => (show ? '50px' : '-100px')};
  left: 50%;
  transform: translate(-50%, 0);
  padding: 10px 50px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 100px;
  transition: all 0.5s ease;
  z-index: 9999;
`;

const Message = styled.p`
  font-size: 14px;
`;

const ToastMessage = ({ message, duration = 2000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timeout = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [message, duration, onClose]);

  return (
    <ToastWrap show={isVisible ? 1 : 0}>
      <Message>{message}</Message>
    </ToastWrap>
  );
};

export default ToastMessage;
