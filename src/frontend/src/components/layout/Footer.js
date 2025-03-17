import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 20px 0;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const Copyright = styled.div`
  color: #6c757d;
  font-size: 14px;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const FooterLink = styled.a`
  color: #6c757d;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    color: #007bff;
    text-decoration: underline;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          &copy; {currentYear} FinTech Innovations. All rights reserved.
        </Copyright>
        <FooterLinks>
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
          <FooterLink href="#">Contact Us</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 