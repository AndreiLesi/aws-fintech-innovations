import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: ${props => props.position.includes('top') ? '20px' : 'auto'};
  bottom: ${props => props.position.includes('bottom') ? '20px' : 'auto'};
  left: ${props => props.position.includes('left') ? '20px' : 'auto'};
  right: ${props => props.position.includes('right') ? '20px' : 'auto'};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  width: 100%;
`;

const NotificationItem = styled.div`
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  background-color: ${props => {
    if (props.type === 'success') return '#d4edda';
    if (props.type === 'error') return '#f8d7da';
    if (props.type === 'warning') return '#fff3cd';
    if (props.type === 'info') return '#d1ecf1';
    return '#ffffff';
  }};
  color: ${props => {
    if (props.type === 'success') return '#155724';
    if (props.type === 'error') return '#721c24';
    if (props.type === 'warning') return '#856404';
    if (props.type === 'info') return '#0c5460';
    return '#212529';
  }};
  border-left: 4px solid ${props => {
    if (props.type === 'success') return '#28a745';
    if (props.type === 'error') return '#dc3545';
    if (props.type === 'warning') return '#ffc107';
    if (props.type === 'info') return '#17a2b8';
    return '#6c757d';
  }};
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-in-out;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const NotificationMessage = styled.div`
  font-size: 14px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  margin-left: 8px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const Notification = ({ 
  notifications = [], 
  position = 'top-right',
  autoClose = true,
  autoCloseTime = 5000,
  onClose
}) => {
  const [exiting, setExiting] = useState({});

  const handleClose = (id) => {
    setExiting(prev => ({ ...prev, [id]: true }));
    
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (autoClose) {
      const timers = notifications.map(notification => {
        return setTimeout(() => {
          handleClose(notification.id);
        }, autoCloseTime);
      });
      
      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [notifications, autoClose, autoCloseTime]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <NotificationContainer position={position}>
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          type={notification.type}
          isExiting={exiting[notification.id]}
        >
          <NotificationContent>
            {notification.title && (
              <NotificationTitle>{notification.title}</NotificationTitle>
            )}
            <NotificationMessage>{notification.message}</NotificationMessage>
          </NotificationContent>
          <CloseButton onClick={() => handleClose(notification.id)}>×</CloseButton>
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
};

export default Notification; 