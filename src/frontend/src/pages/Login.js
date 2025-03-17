import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../utils/validators';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px); /* Adjust for header and footer */
  padding: 20px;
`;

const LoginCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 30px;
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LoginTitle = styled.h1`
  font-size: 24px;
  color: #212529;
  margin-bottom: 10px;
`;

const LoginSubtitle = styled.p`
  color: #6c757d;
  font-size: 16px;
`;

const LoginForm = styled.form`
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

const LoginButton = styled.button`
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

const DemoNotice = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #6c757d;
  text-align: center;
`;

const SignupLink = styled.div`
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

const ErrorCard = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
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
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error is handled by the AuthContext
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <LoginTitle>Welcome to FinTech Innovations</LoginTitle>
          <LoginSubtitle>Sign in to access your financial dashboard</LoginSubtitle>
        </LoginHeader>
        
        {error && <ErrorCard>{error}</ErrorCard>}
        
        <LoginForm onSubmit={handleSubmit}>
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
          </FormGroup>
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </LoginButton>
          
          <SignupLink>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </SignupLink>
        </LoginForm>
        
        {process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID && (
          <DemoNotice>
            <strong>Demo Credentials:</strong><br />
            Email: demo@example.com<br />
            Password: password
          </DemoNotice>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 