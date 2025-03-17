import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const HeaderContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: none;
    color: #0056b3;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0 10px;
`;

const NavLink = styled(Link)`
  color: #495057;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
    color: #007bff;
    text-decoration: none;
  }
  
  &.active {
    color: #007bff;
    background-color: #e9f5ff;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-right: 15px;
  font-weight: 500;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 15px;
  font-size: 20px;
  color: ${props => props.darkMode ? '#ffc107' : '#6c757d'};
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #dc3545;
    color: white;
  }
`;

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">FinTech Innovations</Logo>
        
        {isAuthenticated && (
          <Nav>
            <NavList>
              <NavItem>
                <NavLink 
                  to="/" 
                  className={location.pathname === '/' ? 'active' : ''}
                >
                  Dashboard
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  to="/transactions" 
                  className={location.pathname === '/transactions' ? 'active' : ''}
                >
                  Transactions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  to="/market-analysis" 
                  className={location.pathname === '/market-analysis' ? 'active' : ''}
                >
                  Market Analysis
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                  to="/settings" 
                  className={location.pathname === '/settings' ? 'active' : ''}
                >
                  Settings
                </NavLink>
              </NavItem>
            </NavList>
          </Nav>
        )}
        
        {isAuthenticated && (
          <UserSection>
            <ThemeToggle onClick={toggleTheme} darkMode={darkMode}>
              {darkMode ? '☀️' : '🌙'}
            </ThemeToggle>
            <UserName>
              {user?.name || user?.email || user?.username || 'User'}
            </UserName>
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </UserSection>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 