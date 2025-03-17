import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${props => props.fullPage ? '100vh' : '100%'};
  min-height: ${props => props.fullPage ? 'auto' : '200px'};
  padding: 20px;
`;

const SpinnerWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const Spinner = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: ${props => props.size / 8}px solid #e9e9e9;
  border-radius: 50%;
  border-top-color: #007bff;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  margin-top: 16px;
  font-size: 16px;
  color: #6c757d;
`;

/**
 * A reusable loader/spinner component
 * @param {Object} props - Component props
 * @param {boolean} props.fullPage - Whether the loader should take the full page height
 * @param {number} props.size - Size of the spinner in pixels
 * @param {string} props.text - Text to display below the spinner
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Loader component
 */
const Loader = ({ 
  fullPage = false, 
  size = 40, 
  text = 'Loading...', 
  className 
}) => {
  return (
    <LoaderContainer fullPage={fullPage} className={className}>
      <SpinnerWrapper size={size}>
        <Spinner size={size} />
      </SpinnerWrapper>
      {text && <LoadingText>{text}</LoadingText>}
    </LoaderContainer>
  );
};

export default Loader; 