import axios from 'axios';
import { Auth } from 'aws-amplify';

// Create axios instance with base URL from environment variables
const api = axios.create({
  // Always use the full API URL from environment variables
  baseURL: process.env.REACT_APP_API_URL,
});

// Add authorization header to requests
api.interceptors.request.use(async (config) => {
  try {
    // For development/demo purposes
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      // Add a mock token for development
      config.headers.Authorization = 'Bearer mock-token-for-development';
      return config;
    }
    
    // Real AWS Cognito token
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (error) {
    console.error('Error adding auth header:', error);
    return config;
  }
});

// Mock data for development
const mockTransactions = [
  {
    id: '1',
    date: '2023-05-15',
    description: 'Salary Deposit',
    amount: 3500,
    type: 'credit',
    category: 'Income'
  },
  {
    id: '2',
    date: '2023-05-16',
    description: 'Grocery Shopping',
    amount: 125.50,
    type: 'debit',
    category: 'Expense'
  },
  {
    id: '3',
    date: '2023-05-18',
    description: 'Restaurant Dinner',
    amount: 78.25,
    type: 'debit',
    category: 'Expense'
  },
  {
    id: '4',
    date: '2023-05-20',
    description: 'Investment Dividend',
    amount: 250,
    type: 'credit',
    category: 'Investment'
  },
  {
    id: '5',
    date: '2023-05-22',
    description: 'Utility Bill',
    amount: 95.40,
    type: 'debit',
    category: 'Expense'
  }
];

const mockMarketData = {
  stocks: [
    { symbol: 'AAPL', price: 175.34, change: 2.5 },
    { symbol: 'MSFT', price: 325.12, change: -1.2 },
    { symbol: 'GOOGL', price: 2750.80, change: 0.8 },
    { symbol: 'AMZN', price: 3450.25, change: 1.5 }
  ],
  trends: [
    { date: '2023-05-01', value: 1000 },
    { date: '2023-05-02', value: 1020 },
    { date: '2023-05-03', value: 1015 },
    { date: '2023-05-04', value: 1040 },
    { date: '2023-05-05', value: 1060 },
    { date: '2023-05-06', value: 1055 },
    { date: '2023-05-07', value: 1070 }
  ]
};

// API functions
export const getTransactions = async (options = {}) => {
  // Check if we have a real API URL and we're not in mock mode
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_USER_POOL_ID) {
    try {
      const response = await api.get('/transactions', { params: options });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Return empty array instead of throwing
      return [];
    }
  }
  
  // Fallback to mock data
  console.log('Using mock transaction data');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let transactions = [...mockTransactions];
  
  // Apply filters if provided
  if (options.limit) {
    transactions = transactions.slice(0, options.limit);
  }
  
  return transactions;
};

export const getMarketData = async (options = {}) => {
  // Check if we have a real API URL and we're not in mock mode
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_USER_POOL_ID) {
    try {
      const response = await api.get('/market/data', { params: options });
      // Ensure we always return a properly structured object
      const data = response.data || {};
      return {
        stocks: Array.isArray(data.stocks) ? data.stocks : [],
        trends: Array.isArray(data.trends) ? data.trends : []
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Return empty data structure instead of throwing
      return { stocks: [], trends: [] };
    }
  }
  
  // Fallback to mock data
  console.log('Using mock market data');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would call an API
  return mockMarketData;
};

export const createTransaction = async (transaction) => {
  // Check if we have a real API URL and we're not in mock mode
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_USER_POOL_ID) {
    try {
      const response = await api.post('/transactions', transaction);
      
      // The backend returns the transaction in a nested structure
      // Extract and normalize it for consistent usage
      const responseData = response.data || {};
      
      // If the transaction is nested in a 'transaction' property, extract it
      const transactionData = responseData.transaction || responseData;
      
      // Ensure we have a properly formatted transaction object
      return {
        id: transactionData.id || String(Date.now()),
        date: transactionData.date || new Date().toISOString().split('T')[0],
        description: transactionData.description || '',
        amount: parseFloat(transactionData.amount || 0),
        type: transactionData.type || 'debit',
        category: transactionData.category || 'Other',
        createdAt: transactionData.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }
  
  // Fallback to mock data
  console.log('Using mock create transaction');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newTransaction = {
    id: Date.now().toString(),
    date: transaction.date || new Date().toISOString().split('T')[0],
    description: transaction.description,
    amount: parseFloat(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would call an API
  mockTransactions.unshift(newTransaction);
  
  return newTransaction;
};

/**
 * Update user profile
 * @param {Object} profileData - User profile data
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUserProfile = async (profileData) => {
  // Check if we have a real API URL and we're not in mock mode
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_USER_POOL_ID) {
    try {
      const response = await api.post('/user/profile', profileData);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
  
  // Fallback to mock data
  console.log('Using mock profile update');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would call an API
  // For now, we'll just get the current user from localStorage and update it
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    throw new Error('User not found');
  }
  
  const user = JSON.parse(storedUser);
  const updatedUser = {
    ...user,
    ...profileData
  };
  
  // Update localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return updatedUser;
};

/**
 * Update user preferences
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} - Updated user data
 */
export const updateUserPreferences = async (preferences) => {
  // Check if we have a real API URL and we're not in mock mode
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_USER_POOL_ID) {
    try {
      // Ensure preferences is a proper object
      const preferencesData = { ...preferences };
      
      // Log the preferences data being sent
      console.log('Sending preferences data:', { preferences: preferencesData });
      
      // Send the preferences as an object
      const response = await api.post('/user/profile', { preferences: preferencesData });
      console.log('Preferences update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
  
  // Fallback to mock data
  console.log('Using mock preferences update');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would call an API
  // For now, we'll just get the current user from localStorage and update it
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    throw new Error('User not found');
  }
  
  const user = JSON.parse(storedUser);
  const updatedUser = {
    ...user,
    preferences: {
      ...user.preferences,
      ...preferences
    }
  };
  
  // Update localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return updatedUser;
};

/**
 * Get user profile
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async () => {
  // Check if we have a real API URL and we're not in mock mode
  if (process.env.REACT_APP_API_URL && process.env.REACT_APP_USER_POOL_ID) {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
  
  // Fallback to mock data
  console.log('Using mock user profile');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would call an API
  // For now, we'll just get the current user from localStorage
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return {
      userId: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      firstName: '',
      lastName: '',
      preferences: {
        theme: 'light',
        currency: 'USD',
        notifications: true
      }
    };
  }
  
  return JSON.parse(storedUser);
}; 