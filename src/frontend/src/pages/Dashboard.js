import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTransactions } from '../services/api';
import TransactionList from '../components/dashboard/TransactionList';
import MarketTrends from '../components/dashboard/MarketTrends';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import Loader from '../components/common/Loader';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const DashboardHeader = styled.div`
  margin-bottom: 20px;
`;

const DashboardTitle = styled.h1`
  font-size: 28px;
  color: #212529;
  margin-bottom: 10px;
`;

const DashboardSubtitle = styled.p`
  color: #6c757d;
  font-size: 16px;
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch transactions
      const transactionsData = await getTransactions();
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <Loader fullPage text="Loading dashboard data..." />
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Financial Dashboard</DashboardTitle>
        <DashboardSubtitle>
          Overview of your financial data and market trends
        </DashboardSubtitle>
      </DashboardHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <DashboardContent>
        <FinancialSummary transactions={transactions} />
        <TransactionList transactions={transactions} />
        <MarketTrends />
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard; 