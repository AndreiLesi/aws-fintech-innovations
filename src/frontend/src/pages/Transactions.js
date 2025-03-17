import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { getTransactions, createTransaction } from '../services/api';
import TransactionList from '../components/dashboard/TransactionList';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/formatters';
import { validateAmount, validateRequired } from '../utils/validators';

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

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
`;

const FilterLabel = styled.label`
  margin-right: 10px;
  font-weight: 500;
  color: #495057;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: #fff;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  flex-grow: 1;
  min-width: 200px;
`;

const ButtonContainer = styled.div`
  margin-left: auto;
`;

const TransactionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled(Card)`
  padding: 15px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-top: 5px;
  color: ${props => props.color || '#212529'};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #212529;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${props => props.error ? '#dc3545' : '#ced4da'};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid ${props => props.error ? '#dc3545' : '#ced4da'};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const InputError = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [dateRange, setDateRange] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New transaction form
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: 'Income',
    type: 'credit',
    date: new Date().toISOString().split('T')[0]
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Get unique categories from transactions
  const categories = useMemo(() => {
    // Default categories based on transaction types
    const defaultCategories = {
      credit: ['Income', 'Investment', 'Transfer'],
      debit: ['Expense', 'Bills', 'Shopping', 'Food', 'Transport', 'Entertainment', 'Other']
    };
    
    // If we have transactions, extract unique categories from them
    if (transactions.length > 0) {
      const uniqueCategories = new Set(['all']);
      
      // Add all categories from transactions
      transactions.forEach(t => {
        if (t.category) {
          uniqueCategories.add(t.category);
        }
      });
      
      // Add default categories that might not be in transactions yet
      [...defaultCategories.credit, ...defaultCategories.debit].forEach(cat => {
        uniqueCategories.add(cat);
      });
      
      return Array.from(uniqueCategories);
    }
    
    // Return default categories if no transactions
    return ['all', ...defaultCategories.credit, ...defaultCategories.debit];
  }, [transactions]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions();
        setTransactions(data);
        setFilteredTransactions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load transactions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];
    
    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(t => new Date(t.date) >= startDate);
      }
    }
    
    // Filter by transaction type
    if (transactionType !== 'all') {
      filtered = filtered.filter(t => t.type === transactionType);
    }
    
    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(t => t.category === category);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) || 
        t.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, dateRange, transactionType, category, searchQuery]);
  
  const calculateStats = () => {
    if (filteredTransactions.length === 0) {
      return {
        totalTransactions: 0,
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0
      };
    }
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'credit') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });
    
    return {
      totalTransactions: filteredTransactions.length,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    };
  };
  
  const stats = calculateStats();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      // When type changes, update the category to match the type
      const newType = value;
      let newCategory = newTransaction.category;
      
      // Set appropriate default category based on transaction type
      if (newType === 'credit' && !['Income', 'Investment', 'Transfer'].includes(newTransaction.category)) {
        newCategory = 'Income';
      } else if (newType === 'debit' && !['Expense', 'Bills', 'Shopping', 'Food', 'Transport', 'Entertainment', 'Other'].includes(newTransaction.category)) {
        newCategory = 'Expense';
      }
      
      setNewTransaction(prev => ({ 
        ...prev, 
        [name]: value,
        category: newCategory
      }));
    } else {
      setNewTransaction(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const { isValid, errors } = validateRequired(newTransaction, ['description', 'amount', 'category']);
    
    if (newTransaction.amount) {
      const amountValidation = validateAmount(newTransaction.amount);
      if (!amountValidation.isValid) {
        errors.amount = amountValidation.message;
      }
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Prepare transaction data with proper types
      const transactionData = {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
        // Ensure date is in the correct format
        date: newTransaction.date || new Date().toISOString().split('T')[0]
      };
      
      // Create the transaction
      const createdTransaction = await createTransaction(transactionData);
      
      // Add the new transaction to the state
      setTransactions(prev => [createdTransaction, ...prev]);
      
      // Close the modal
      setShowModal(false);
      
      // Reset form
      setNewTransaction({
        description: '',
        amount: '',
        category: 'Income',
        type: 'credit',
        date: new Date().toISOString().split('T')[0]
      });
      setFormErrors({});
      
      // Refresh the transactions list to update the summary stats
      const fetchTransactions = async () => {
        try {
          const data = await getTransactions();
          setTransactions(data);
          setFilteredTransactions(data);
        } catch (err) {
          console.error('Error refreshing transactions:', err);
        }
      };
      
      // Fetch updated transactions after a short delay to allow the backend to process
      setTimeout(fetchTransactions, 500);
    } catch (err) {
      setError('Failed to create transaction. Please try again.');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Loader fullPage text="Loading transactions..." />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Transactions</PageTitle>
        <PageSubtitle>View and manage your financial transactions</PageSubtitle>
      </PageHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <TransactionStats>
        <StatCard>
          <StatLabel>Total Transactions</StatLabel>
          <StatValue>{stats.totalTransactions}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatLabel>Total Income</StatLabel>
          <StatValue color="#28a745">{formatCurrency(stats.totalIncome)}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatLabel>Total Expenses</StatLabel>
          <StatValue color="#dc3545">{formatCurrency(stats.totalExpenses)}</StatValue>
        </StatCard>
        
        <StatCard>
          <StatLabel>Balance</StatLabel>
          <StatValue color={stats.balance >= 0 ? '#28a745' : '#dc3545'}>
            {formatCurrency(stats.balance)}
          </StatValue>
        </StatCard>
      </TransactionStats>
      
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>Date Range:</FilterLabel>
          <FilterSelect 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Type:</FilterLabel>
          <FilterSelect 
            value={transactionType} 
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="credit">Income</option>
            <option value="debit">Expense</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Category:</FilterLabel>
          <FilterSelect 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <SearchInput 
          type="text" 
          placeholder="Search transactions..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <ButtonContainer>
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
          >
            Add Transaction
          </Button>
        </ButtonContainer>
      </FiltersContainer>
      
      <TransactionList 
        transactions={filteredTransactions} 
        title={`Transactions (${filteredTransactions.length})`} 
      />
      
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New Transaction</ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  error={formErrors.description}
                />
                {formErrors.description && (
                  <InputError>{formErrors.description}</InputError>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  error={formErrors.amount}
                />
                {formErrors.amount && (
                  <InputError>{formErrors.amount}</InputError>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="type">Transaction Type</Label>
                <Select 
                  id="type"
                  name="type"
                  value={newTransaction.type}
                  onChange={handleInputChange}
                >
                  <option value="credit">Income</option>
                  <option value="debit">Expense</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="category">Category</Label>
                <Select 
                  id="category"
                  name="category"
                  value={newTransaction.category}
                  onChange={handleInputChange}
                  error={formErrors.category}
                >
                  {newTransaction.type === 'credit' ? (
                    // Income categories
                    <>
                      <option value="Income">Income</option>
                      <option value="Investment">Investment</option>
                      <option value="Transfer">Transfer</option>
                    </>
                  ) : (
                    // Expense categories
                    <>
                      <option value="Expense">Expense</option>
                      <option value="Bills">Bills</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </Select>
                {formErrors.category && (
                  <InputError>{formErrors.category}</InputError>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  name="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormActions>
                <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Add Transaction
                </Button>
              </FormActions>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Transactions; 