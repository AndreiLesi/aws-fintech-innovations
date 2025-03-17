import React, { createContext, useState, useContext, useEffect } from 'react';
import { signIn, signOut, getCurrentUser, signUp, confirmSignUp, resendConfirmationCode } from '../services/auth';
import { getUserProfile } from '../services/api';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // Check if we're using real AWS Cognito
        if (process.env.REACT_APP_USER_POOL_ID) {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            // Fetch the user profile from our API
            try {
              const userProfile = await getUserProfile();
              // Merge Cognito user with profile data
              setUser({
                ...currentUser,
                ...userProfile
              });
              setIsAuthenticated(true);
            } catch (profileError) {
              console.error('Failed to fetch user profile:', profileError);
              // Still set the Cognito user even if profile fetch fails
              setUser(currentUser);
              setIsAuthenticated(true);
            }
          }
        } else {
          // Fallback to local storage for development
          const storedUser = localStorage.getItem('user');
          const isAuth = localStorage.getItem('isAuthenticated') === 'true';
          
          if (storedUser && isAuth) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Check if we're using real AWS Cognito
      if (process.env.REACT_APP_USER_POOL_ID) {
        const cognitoUser = await signIn(email, password);
        
        // Fetch the user profile from our API
        try {
          const userProfile = await getUserProfile();
          // Merge Cognito user with profile data
          setUser({
            ...cognitoUser,
            ...userProfile
          });
        } catch (profileError) {
          console.error('Failed to fetch user profile:', profileError);
          // Still set the Cognito user even if profile fetch fails
          setUser(cognitoUser);
        }
        
        setIsAuthenticated(true);
        return { success: true };
      } else {
        // Fallback to mock authentication for development
        // For demo purposes, we'll just check against hardcoded values
        if (email === 'demo@example.com' && password === 'password') {
          const userData = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            avatar: '',
            bio: 'This is a demo account for testing purposes.',
            preferences: {
              theme: 'light',
              currency: 'USD',
              language: 'en',
              notifications: {
                email: true,
                push: true,
                sms: false
              },
              dashboardLayout: 'default'
            }
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isAuthenticated', 'true');
          return { success: true };
        } else {
          setError('Invalid email or password. Try demo@example.com / password');
          return { 
            success: false, 
            message: 'Invalid email or password. Try demo@example.com / password' 
          };
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific Cognito errors
      if (error.code === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your account before logging in.';
      } else if (error.code === 'NotAuthorizedException') {
        errorMessage = 'Incorrect username or password.';
      } else if (error.code === 'UserNotFoundException') {
        errorMessage = 'User does not exist.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        code: error.code
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUp(email, password, name);
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle specific Cognito errors
      if (error.code === 'UsernameExistsException') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        code: error.code
      };
    } finally {
      setLoading(false);
    }
  };

  const confirmRegistration = async (email, code) => {
    setLoading(true);
    setError(null);
    try {
      const result = await confirmSignUp(email, code);
      return result;
    } catch (error) {
      console.error('Confirmation failed:', error);
      let errorMessage = 'Confirmation failed. Please try again.';
      
      // Handle specific Cognito errors
      if (error.code === 'CodeMismatchException') {
        errorMessage = 'Invalid verification code.';
      } else if (error.code === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        code: error.code
      };
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const result = await resendConfirmationCode(email);
      return result;
    } catch (error) {
      console.error('Resend code failed:', error);
      let errorMessage = 'Failed to resend code. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        code: error.code
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if we're using real AWS Cognito
      if (process.env.REACT_APP_USER_POOL_ID) {
        await signOut();
      } else {
        // Fallback for development
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    console.log('Updating user data:', userData);
    
    // Merge the new user data with the existing user data
    const updatedUser = {
      ...user,
      ...userData
    };
    
    setUser(updatedUser);
    
    // Only update localStorage in development mode
    if (!process.env.REACT_APP_USER_POOL_ID) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    logout,
    register,
    confirmRegistration,
    resendCode,
    updateUser,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the AuthContext as well for direct usage
export { AuthContext }; 