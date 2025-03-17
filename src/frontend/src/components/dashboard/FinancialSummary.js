import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
`;

const SummaryCard = styled(Card)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const SummaryTitle = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 12px;
  font-weight: 500;
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.color || '#212529'};
`;

const SummaryChange = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  color: ${props => props.isPositive ? '#28a745' : '#dc3545'};
  font-weight: 500;
  
  svg {
    margin-right: 5px;
  }
`;

const ArrowUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4L4 8H12L8 4Z" fill="#28a745" />
  </svg>
);

const ArrowDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12L12 8H4L8 12Z" fill="#dc3545" />
  </svg>
);

/**
 * Component for displaying financial summary metrics
 * @param {Object} props - Component props
 * @param {Array} props.transactions - Array of transaction objects
 * @returns {React.ReactElement} FinancialSummary component
 */
const FinancialSummary = ({ transactions = [] }) => {
  const summary = useMemo(() => {
    // Default values to prevent NaN
    const defaultSummary = {
      totalBalance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      incomeChange: 0,
      expenseChange: 0
    };

    // If no transactions, return default values
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return defaultSummary;
    }

    // Calculate totals
    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let previousMonthIncome = 0;
    let previousMonthExpenses = 0;

    // Get current and previous month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    transactions.forEach(transaction => {
      // Skip transactions with invalid data
      if (transaction.amount === undefined || transaction.amount === null || isNaN(parseFloat(transaction.amount))) {
        console.warn('Transaction with invalid amount:', transaction);
        return;
      }
      
      if (!transaction.date) {
        console.warn('Transaction with missing date:', transaction);
        return;
      }
      
      // Parse the date safely
      let transactionDate;
      try {
        transactionDate = new Date(transaction.date);
        
        if (isNaN(transactionDate.getTime())) {
          console.warn('Transaction with invalid date:', transaction);
          return;
        }
      } catch (error) {
        console.warn('Error parsing transaction date:', error, transaction);
        return;
      }
      
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();
      const amount = parseFloat(transaction.amount);

      if (transaction.type === 'credit') {
        totalIncome += amount;

        // Current month income
        if (transactionMonth === currentMonth && transactionYear === currentYear) {
          monthlyIncome += amount;
        }
        
        // Previous month income
        if (transactionMonth === previousMonth && transactionYear === previousYear) {
          previousMonthIncome += amount;
        }
      } else {
        totalExpenses += amount;

        // Current month expenses
        if (transactionMonth === currentMonth && transactionYear === currentYear) {
          monthlyExpenses += amount;
        }
        
        // Previous month expenses
        if (transactionMonth === previousMonth && transactionYear === previousYear) {
          previousMonthExpenses += amount;
        }
      }
    });

    // Calculate month-over-month changes
    const incomeChange = previousMonthIncome === 0 
      ? 0 
      : ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100;
      
    const expenseChange = previousMonthExpenses === 0 
      ? 0 
      : ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      incomeChange: isNaN(incomeChange) ? 0 : incomeChange,
      expenseChange: isNaN(expenseChange) ? 0 : expenseChange
    };
  }, [transactions]);

  return (
    <SummaryContainer>
      <SummaryCard>
        <SummaryTitle>Total Balance</SummaryTitle>
        <SummaryValue color={summary.totalBalance >= 0 ? '#28a745' : '#dc3545'}>
          {formatCurrency(summary.totalBalance)}
        </SummaryValue>
      </SummaryCard>

      <SummaryCard>
        <SummaryTitle>Monthly Income</SummaryTitle>
        <SummaryValue color="#28a745">
          {formatCurrency(summary.monthlyIncome)}
        </SummaryValue>
        <SummaryChange isPositive={summary.incomeChange >= 0}>
          {summary.incomeChange >= 0 ? <ArrowUp /> : <ArrowDown />}
          {Math.abs(summary.incomeChange).toFixed(1)}% from last month
        </SummaryChange>
      </SummaryCard>

      <SummaryCard>
        <SummaryTitle>Monthly Expenses</SummaryTitle>
        <SummaryValue color="#dc3545">
          {formatCurrency(summary.monthlyExpenses)}
        </SummaryValue>
        <SummaryChange isPositive={summary.expenseChange <= 0}>
          {summary.expenseChange <= 0 ? <ArrowUp /> : <ArrowDown />}
          {Math.abs(summary.expenseChange).toFixed(1)}% from last month
        </SummaryChange>
      </SummaryCard>

      <SummaryCard>
        <SummaryTitle>Savings Rate</SummaryTitle>
        <SummaryValue>
          {summary.monthlyIncome === 0 
            ? '0%' 
            : `${Math.round(((summary.monthlyIncome - summary.monthlyExpenses) / summary.monthlyIncome) * 100)}%`
          }
        </SummaryValue>
      </SummaryCard>
    </SummaryContainer>
  );
};

export default FinancialSummary; 