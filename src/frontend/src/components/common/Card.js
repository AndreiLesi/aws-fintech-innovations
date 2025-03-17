import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

/**
 * A reusable card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Card component
 */
const Card = ({ children, className, ...rest }) => {
  return (
    <CardContainer className={className} {...rest}>
      {children}
    </CardContainer>
  );
};

export default Card; 