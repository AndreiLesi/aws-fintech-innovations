import React from 'react';
import styled, { css } from 'styled-components';

// Button variants
const variants = {
  primary: css`
    background-color: #007bff;
    color: #fff;
    border: 1px solid #007bff;
    
    &:hover:not(:disabled) {
      background-color: #0069d9;
      border-color: #0062cc;
    }
    
    &:active:not(:disabled) {
      background-color: #0062cc;
      border-color: #005cbf;
    }
  `,
  secondary: css`
    background-color: #6c757d;
    color: #fff;
    border: 1px solid #6c757d;
    
    &:hover:not(:disabled) {
      background-color: #5a6268;
      border-color: #545b62;
    }
    
    &:active:not(:disabled) {
      background-color: #545b62;
      border-color: #4e555b;
    }
  `,
  success: css`
    background-color: #28a745;
    color: #fff;
    border: 1px solid #28a745;
    
    &:hover:not(:disabled) {
      background-color: #218838;
      border-color: #1e7e34;
    }
    
    &:active:not(:disabled) {
      background-color: #1e7e34;
      border-color: #1c7430;
    }
  `,
  danger: css`
    background-color: #dc3545;
    color: #fff;
    border: 1px solid #dc3545;
    
    &:hover:not(:disabled) {
      background-color: #c82333;
      border-color: #bd2130;
    }
    
    &:active:not(:disabled) {
      background-color: #bd2130;
      border-color: #b21f2d;
    }
  `,
  outline: css`
    background-color: transparent;
    color: #007bff;
    border: 1px solid #007bff;
    
    &:hover:not(:disabled) {
      background-color: #007bff;
      color: #fff;
    }
    
    &:active:not(:disabled) {
      background-color: #0069d9;
      border-color: #0062cc;
      color: #fff;
    }
  `,
  text: css`
    background-color: transparent;
    color: #007bff;
    border: none;
    padding-left: 0;
    padding-right: 0;
    
    &:hover:not(:disabled) {
      color: #0056b3;
      text-decoration: underline;
    }
    
    &:active:not(:disabled) {
      color: #004085;
    }
  `
};

// Button sizes
const sizes = {
  small: css`
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.2rem;
  `,
  medium: css`
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border-radius: 0.25rem;
  `,
  large: css`
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
    border-radius: 0.3rem;
  `
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, 
              border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
  
  ${props => variants[props.variant || 'primary']}
  ${props => sizes[props.size || 'medium']}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: ${props => props.iconOnly ? '0' : '0.5rem'};
  }
`;

/**
 * A reusable button component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, success, danger, outline, text)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {React.ReactNode} props.icon - Icon to display before text
 * @param {boolean} props.iconOnly - Whether the button only contains an icon
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Button component
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  disabled = false,
  icon,
  iconOnly = false,
  type = 'button',
  onClick,
  className,
  ...rest 
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      iconOnly={iconOnly}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );
};

export default Button; 