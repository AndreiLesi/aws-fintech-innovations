import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../utils/validators';

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px); /* Adjust for header and footer */
  padding: 20px;
`;

const SignupCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 30px;
  width: 100%;
  max-width: 450px;
`;

const SignupHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const SignupTitle = styled.h1`
  font-size: 24px;
  color: #212529;
  margin-bottom: 10px;
`;

const SignupSubtitle = styled.p`
  color: #6c757d;
  font-size: 16px;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.error ? '#dc3545' : '#ced4da'};
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

const SuccessText = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
`;

const SignupButton = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 15px;
  
  &:hover {
    background-color: #0069d9;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  
  a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PasswordRequirements = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
`;

const ConfirmationSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-top: 10px;
  
  &:hover {
    color: #0056b3;
  }
  
  &:disabled {
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('signup'); // signup, confirm
  const [confirmationCode, setConfirmationCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, confirmRegistration, resendCode, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateConfirmationForm = () => {
    const newErrors = {};
    
    if (!confirmationCode) {
      newErrors.confirmationCode = 'Confirmation code is required';
    } else if (confirmationCode.length < 6) {
      newErrors.confirmationCode = 'Confirmation code must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        if (result.userConfirmed) {
          // User is already confirmed, redirect to login
          setSuccessMessage('Account created successfully! You can now log in.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          // User needs to confirm their account
          setStep('confirm');
          setSuccessMessage('Account created! Please check your email for a confirmation code.');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Error is handled by the AuthContext
    }
  };
  
  const handleConfirmationSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateConfirmationForm()) {
      return;
    }
    
    try {
      const result = await confirmRegistration(email, confirmationCode);
      
      if (result.success) {
        setSuccessMessage('Account confirmed successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      // Error is handled by the AuthContext
    }
  };
  
  const handleResendCode = async () => {
    clearError();
    
    try {
      const result = await resendCode(email);
      
      if (result.success) {
        setSuccessMessage('A new confirmation code has been sent to your email.');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      // Error is handled by the AuthContext
    }
  };
  
  return (
    <SignupContainer>
      <SignupCard>
        <SignupHeader>
          <SignupTitle>Create an Account</SignupTitle>
          <SignupSubtitle>Join FinTech Innovations to manage your finances</SignupSubtitle>
        </SignupHeader>
        
        {successMessage && <SuccessText>{successMessage}</SuccessText>}
        
        {step === 'signup' ? (
          <SignupForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                disabled={loading}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                disabled={loading}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                disabled={loading}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
              <PasswordRequirements>
                Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
              </PasswordRequirements>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                disabled={loading}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
            </FormGroup>
            
            {error && <ErrorText>{error}</ErrorText>}
            
            <SignupButton type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </SignupButton>
            
            <LoginLink>
              Already have an account? <Link to="/login">Sign In</Link>
            </LoginLink>
          </SignupForm>
        ) : (
          <ConfirmationSection>
            <SignupForm onSubmit={handleConfirmationSubmit}>
              <FormGroup>
                <Label htmlFor="confirmationCode">Confirmation Code</Label>
                <Input
                  id="confirmationCode"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  error={errors.confirmationCode}
                  disabled={loading}
                />
                {errors.confirmationCode && <ErrorText>{errors.confirmationCode}</ErrorText>}
              </FormGroup>
              
              {error && <ErrorText>{error}</ErrorText>}
              
              <SignupButton type="submit" disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm Account'}
              </SignupButton>
              
              <div style={{ textAlign: 'center' }}>
                <ResendButton 
                  type="button" 
                  onClick={handleResendCode} 
                  disabled={loading}
                >
                  Resend confirmation code
                </ResendButton>
              </div>
            </SignupForm>
          </ConfirmationSection>
        )}
      </SignupCard>
    </SignupContainer>
  );
};

export default Signup; 