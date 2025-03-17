import React from 'react';
import styled from 'styled-components';
import MarketAnalysisComponent from '../components/dashboard/MarketAnalysis';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
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

const MarketAnalysisPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Market Analysis</PageTitle>
        <PageSubtitle>
          Detailed analysis of major tech stocks and market indicators
        </PageSubtitle>
      </PageHeader>
      
      <MarketAnalysisComponent />
    </PageContainer>
  );
};

export default MarketAnalysisPage; 