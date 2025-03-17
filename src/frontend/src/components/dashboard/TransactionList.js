import React from 'react';
import styled from 'styled-components';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Card from '../common/Card';

const TransactionListContainer = styled(Card)`
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
`;

const ListTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #212529;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -17px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #007bff;
    border-radius: 3px;
  }
`;

const ListActions = styled.div`
  display: flex;
  gap: 10px;
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #6c757d;
  font-size: 16px;
  background-color: #f8f9fa;
  border-radius: 12px;
`;

const TransactionTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  
  th, td {
    padding: 16px;
    text-align: left;
  }
  
  th {
    font-weight: 600;
    color: #495057;
    background-color: #f8f9fa;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  th:first-child {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  
  th:last-child {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  
  tbody tr {
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s ease;
  }
  
  tbody tr:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 768px) {
    display: block;
    
    thead, tbody, th, td, tr {
      display: block;
    }
    
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    
    tr {
      border-bottom: 2px solid #e9ecef;
      margin-bottom: 15px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    td {
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 50%;
      
      &:before {
        position: absolute;
        top: 16px;
        left: 16px;
        width: 45%;
        padding-right: 10px;
        white-space: nowrap;
        font-weight: 600;
      }
      
      &:nth-of-type(1):before { content: "Date"; }
      &:nth-of-type(2):before { content: "Description"; }
      &:nth-of-type(3):before { content: "Category"; }
      &:nth-of-type(4):before { content: "Amount"; }
    }
  }
`;

const TransactionAmount = styled.span`
  color: ${props => props.type === 'credit' ? '#28a745' : '#dc3545'};
  font-weight: 600;
`;

const TransactionCategory = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    // Use transaction type if available, otherwise infer from category
    if (props.type === 'credit' || ['Income', 'Investment', 'Transfer'].includes(props.category)) {
      return '#d4edda'; // Light green background for income
    } else if (props.type === 'debit' || ['Expense', 'Bills', 'Shopping', 'Food', 'Transport', 'Entertainment', 'Other'].includes(props.category)) {
      return '#f8d7da'; // Light red background for expenses
    } else {
      return '#e9ecef'; // Light gray background as fallback
    }
  }};
  color: ${props => {
    // Use transaction type if available, otherwise infer from category
    if (props.type === 'credit' || ['Income', 'Investment', 'Transfer'].includes(props.category)) {
      return '#155724'; // Dark green text for income
    } else if (props.type === 'debit' || ['Expense', 'Bills', 'Shopping', 'Food', 'Transport', 'Entertainment', 'Other'].includes(props.category)) {
      return '#721c24'; // Dark red text for expenses
    } else {
      return '#495057'; // Dark gray text as fallback
    }
  }};
`;

/**
 * Component for displaying a list of transactions
 * @param {Object} props - Component props
 * @param {Array} props.transactions - Array of transaction objects
 * @param {string} props.title - Title for the transaction list
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {Function} props.onViewAll - Handler for "View All" button click
 * @returns {React.ReactElement} TransactionList component
 */
const TransactionList = ({ 
  transactions = [], 
  title = 'Recent Transactions',
  showActions = false,
  onViewAll
}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <TransactionListContainer>
        <ListHeader>
          <ListTitle>{title}</ListTitle>
        </ListHeader>
        <EmptyState>No transactions found</EmptyState>
      </TransactionListContainer>
    );
  }

  return (
    <TransactionListContainer>
      <ListHeader>
        <ListTitle>{title}</ListTitle>
        {showActions && onViewAll && (
          <ListActions>
            <button onClick={onViewAll}>View All</button>
          </ListActions>
        )}
      </ListHeader>
      
      <TransactionTable>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.description}</td>
              <td>
                <TransactionCategory 
                  category={transaction.category || 'Other'}
                  type={transaction.type}
                >
                  {transaction.category || 'Other'}
                </TransactionCategory>
              </td>
              <td>
                <TransactionAmount type={transaction.type}>
                  {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </TransactionAmount>
              </td>
            </tr>
          ))}
        </tbody>
      </TransactionTable>
    </TransactionListContainer>
  );
};

export default TransactionList; 