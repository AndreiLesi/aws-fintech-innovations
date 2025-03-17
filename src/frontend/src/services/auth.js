import { Auth } from 'aws-amplify';

export const configureAmplify = () => {
  Auth.configure({
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    mandatorySignIn: true,
  });
};

export const signIn = async (username, password) => {
  try {
    // For development/demo purposes when not connected to AWS
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      console.log('Using mock authentication in development mode');
      if (username === 'demo@example.com' && password === 'password') {
        return { username: 'demo@example.com', name: 'Demo User' };
      } else {
        throw new Error('Invalid credentials');
      }
    }
    
    // Real AWS Cognito authentication
    const user = await Auth.signIn(username, password);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signUp = async (email, password, name) => {
  try {
    // For development/demo purposes when not connected to AWS
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      console.log('Using mock sign up in development mode');
      return { 
        success: true, 
        user: { username: email, name: name },
        userConfirmed: true
      };
    }
    
    // Real AWS Cognito sign up
    const { user, userConfirmed } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name
      }
    });
    
    return { success: true, user, userConfirmed };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const confirmSignUp = async (email, code) => {
  try {
    // For development/demo purposes when not connected to AWS
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      console.log('Using mock confirm sign up in development mode');
      return { success: true };
    }
    
    // Real AWS Cognito confirm sign up
    await Auth.confirmSignUp(email, code);
    return { success: true };
  } catch (error) {
    console.error('Error confirming sign up:', error);
    throw error;
  }
};

export const resendConfirmationCode = async (email) => {
  try {
    // For development/demo purposes when not connected to AWS
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      console.log('Using mock resend confirmation code in development mode');
      return { success: true };
    }
    
    // Real AWS Cognito resend confirmation code
    await Auth.resendSignUp(email);
    return { success: true };
  } catch (error) {
    console.error('Error resending confirmation code:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // For development/demo purposes
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      console.log('Using mock sign out in development mode');
      return;
    }
    
    // Real AWS Cognito sign out
    await Auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // For development/demo purposes
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      console.log('Using mock current user in development mode');
      if (localStorage.getItem('isAuthenticated') === 'true') {
        return { username: 'demo@example.com', name: 'Demo User' };
      }
      return null;
    }
    
    // Real AWS Cognito get current user
    return await Auth.currentAuthenticatedUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Change user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Result of the operation
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    // For development/demo purposes
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      console.log('Using mock change password in development mode');
      return { success: true };
    }
    
    // Get current authenticated user
    const user = await Auth.currentAuthenticatedUser();
    console.log('Changing password for user:', user.username);
    
    // Change password using Cognito
    await Auth.changePassword(user, oldPassword, newPassword);
    
    return { success: true };
  } catch (error) {
    console.error('Error changing password:', error);
    
    // Handle specific Cognito errors
    if (error.code === 'NotAuthorizedException') {
      throw new Error('Current password is incorrect');
    } else if (error.code === 'InvalidPasswordException') {
      throw new Error('New password does not meet requirements');
    } else if (error.code === 'LimitExceededException') {
      throw new Error('Too many attempts. Please try again later.');
    } else if (error.message) {
      // Log the full error for debugging
      console.log('Cognito error details:', JSON.stringify(error));
      throw new Error(error.message);
    } else {
      throw new Error('Failed to change password. Please try again.');
    }
  }
}; 