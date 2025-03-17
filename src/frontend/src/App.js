import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { configureAmplify } from './services/auth';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import MarketAnalysis from './pages/MarketAnalysis';
import Settings from './pages/Settings';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  useEffect(() => {
    // Configure AWS Amplify
    configureAmplify();
    
    // For demo purposes only - remove in production
    if (process.env.REACT_APP_ENV === 'development' && !process.env.REACT_APP_USER_POOL_ID) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/market-analysis" 
                element={
                  <ProtectedRoute>
                    <MarketAnalysis />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 