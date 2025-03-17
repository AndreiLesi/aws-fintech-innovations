import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { updateUserProfile, updateUserPreferences } from '../services/api';
import { validateEmail, validateRequired } from '../utils/validators';
import { changePassword } from '../services/auth';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  color: #212529;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  color: #6c757d;
  font-size: 16px;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 250px 1fr;
  }
`;

const SettingsNav = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const NavItem = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  border-left: 3px solid ${props => props.active ? '#007bff' : 'transparent'};
  background-color: ${props => props.active ? '#f8f9fa' : 'transparent'};
  color: ${props => props.active ? '#007bff' : '#212529'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
`;

const SettingsContent = styled(Card)`
  padding: 25px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #212529;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${props => props.error ? '#dc3545' : '#ced4da'};
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  background-color: #fff;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  input {
    width: 18px;
    height: 18px;
  }
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  padding: 10px 15px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.div`
  padding: 10px 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #6c757d;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: ''
  });
  const [profileErrors, setProfileErrors] = useState({});
  
  // Preferences form state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    currency: 'USD',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    dashboardLayout: 'default'
  });
  
  // Security form state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityErrors, setSecurityErrors] = useState({});
  
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
      
      if (user.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...user.preferences
        }));
      }
    }
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1];
      setPreferences(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (securityErrors[name]) {
      setSecurityErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateProfileForm = () => {
    const { isValid, errors } = validateRequired(profile, ['name', 'email']);
    
    if (profile.email) {
      const emailValidation = validateEmail(profile.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.message;
      }
    }
    
    setProfileErrors(errors);
    return isValid;
  };
  
  const validateSecurityForm = () => {
    const { isValid, errors } = validateRequired(security, ['currentPassword', 'newPassword', 'confirmPassword']);
    
    if (security.newPassword && security.confirmPassword && security.newPassword !== security.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Simplified password validation to match Cognito requirements
    if (security.newPassword) {
      // Require at least 8 characters with at least one uppercase, one lowercase, one number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(security.newPassword)) {
        errors.newPassword = 'Password must be at least 8 characters and include uppercase, lowercase, and numbers';
      }
    }
    
    setSecurityErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Send only the necessary profile data
      const profileData = {
        name: profile.name,
        email: profile.email,
        bio: profile.bio
      };
      
      console.log('Submitting profile data:', profileData);
      const updatedUser = await updateUserProfile(profileData);
      console.log('Received updated user data:', updatedUser);
      
      // Update the user context with the response from the API
      updateUser(updatedUser);
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Ensure preferences is a proper object
      const preferencesData = {
        theme: preferences.theme || 'light',
        currency: preferences.currency || 'USD',
        language: preferences.language || 'en',
        notifications: preferences.notifications || {
          email: true,
          push: true,
          sms: false
        },
        dashboardLayout: preferences.dashboardLayout || 'default'
      };
      
      console.log('Submitting preferences data:', preferencesData);
      const updatedUser = await updateUserPreferences(preferencesData);
      console.log('Received updated user data:', updatedUser);
      
      // Update the user context with the response from the API
      updateUser(updatedUser);
      
      setSuccess('Preferences updated successfully');
    } catch (err) {
      setError('Failed to update preferences. Please try again.');
      console.error('Preferences update error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSecurityForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Call the changePassword function from auth.js
      await changePassword(security.currentPassword, security.newPassword);
      
      setSuccess('Password changed successfully');
      setSecurity({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <>
            <SectionTitle>Profile Information</SectionTitle>
            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <AvatarSection>
              <Avatar>
                {profile.avatar ? (
                  <img src={profile.avatar} alt="User avatar" />
                ) : (
                  profile.name ? profile.name.charAt(0).toUpperCase() : 'U'
                )}
              </Avatar>
              <AvatarUpload>
                <Button variant="secondary" size="small">Upload New Photo</Button>
                <Button variant="text" size="small">Remove Photo</Button>
              </AvatarUpload>
            </AvatarSection>
            
            <Form onSubmit={handleProfileSubmit}>
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  error={profileErrors.name}
                />
                {profileErrors.name && <ErrorText>{profileErrors.name}</ErrorText>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  error={profileErrors.email}
                />
                {profileErrors.email && <ErrorText>{profileErrors.email}</ErrorText>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio"
                  name="bio"
                  as="textarea"
                  rows="4"
                  value={profile.bio}
                  onChange={handleProfileChange}
                />
              </FormGroup>
              
              <FormActions>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </FormActions>
            </Form>
          </>
        );
        
      case 'preferences':
        return (
          <>
            <SectionTitle>User Preferences</SectionTitle>
            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Form onSubmit={handlePreferencesSubmit}>
              <FormGroup>
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  id="theme"
                  name="theme"
                  value={preferences.theme}
                  onChange={handlePreferencesChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  id="currency"
                  name="currency"
                  value={preferences.currency}
                  onChange={handlePreferencesChange}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="language">Language</Label>
                <Select 
                  id="language"
                  name="language"
                  value={preferences.language}
                  onChange={handlePreferencesChange}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Notifications</Label>
                <Checkbox>
                  <input 
                    type="checkbox" 
                    id="notifications.email"
                    name="notifications.email"
                    checked={preferences.notifications.email}
                    onChange={handlePreferencesChange}
                  />
                  <label htmlFor="notifications.email">Email Notifications</label>
                </Checkbox>
                
                <Checkbox>
                  <input 
                    type="checkbox" 
                    id="notifications.push"
                    name="notifications.push"
                    checked={preferences.notifications.push}
                    onChange={handlePreferencesChange}
                  />
                  <label htmlFor="notifications.push">Push Notifications</label>
                </Checkbox>
                
                <Checkbox>
                  <input 
                    type="checkbox" 
                    id="notifications.sms"
                    name="notifications.sms"
                    checked={preferences.notifications.sms}
                    onChange={handlePreferencesChange}
                  />
                  <label htmlFor="notifications.sms">SMS Notifications</label>
                </Checkbox>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="dashboardLayout">Dashboard Layout</Label>
                <Select 
                  id="dashboardLayout"
                  name="dashboardLayout"
                  value={preferences.dashboardLayout}
                  onChange={handlePreferencesChange}
                >
                  <option value="default">Default</option>
                  <option value="compact">Compact</option>
                  <option value="expanded">Expanded</option>
                </Select>
              </FormGroup>
              
              <FormActions>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </FormActions>
            </Form>
          </>
        );
        
      case 'security':
        return (
          <>
            <SectionTitle>Security Settings</SectionTitle>
            {success && <SuccessMessage>{success}</SuccessMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Form onSubmit={handleSecuritySubmit}>
              <FormGroup>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={security.currentPassword}
                  onChange={handleSecurityChange}
                  error={securityErrors.currentPassword}
                />
                {securityErrors.currentPassword && <ErrorText>{securityErrors.currentPassword}</ErrorText>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={security.newPassword}
                  onChange={handleSecurityChange}
                  error={securityErrors.newPassword}
                />
                {securityErrors.newPassword && <ErrorText>{securityErrors.newPassword}</ErrorText>}
                <small style={{ color: '#6c757d', marginTop: '5px', display: 'block' }}>
                  Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                </small>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={security.confirmPassword}
                  onChange={handleSecurityChange}
                  error={securityErrors.confirmPassword}
                />
                {securityErrors.confirmPassword && <ErrorText>{securityErrors.confirmPassword}</ErrorText>}
              </FormGroup>
              
              <FormActions>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </FormActions>
            </Form>
          </>
        );
        
      default:
        return null;
    }
  };
  
  if (!user) {
    return (
      <PageContainer>
        <Loader fullPage text="Loading user data..." />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account settings and preferences</PageSubtitle>
      </PageHeader>
      
      <SettingsGrid>
        <SettingsNav>
          <NavItem 
            active={activeSection === 'profile'} 
            onClick={() => setActiveSection('profile')}
          >
            Profile
          </NavItem>
          <NavItem 
            active={activeSection === 'preferences'} 
            onClick={() => setActiveSection('preferences')}
          >
            Preferences
          </NavItem>
          <NavItem 
            active={activeSection === 'security'} 
            onClick={() => setActiveSection('security')}
          >
            Security
          </NavItem>
        </SettingsNav>
        
        <SettingsContent>
          {renderContent()}
        </SettingsContent>
      </SettingsGrid>
    </PageContainer>
  );
};

export default Settings; 