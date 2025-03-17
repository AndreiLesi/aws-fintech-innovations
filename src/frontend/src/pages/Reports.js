import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTransactions } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import { formatCurrency, formatDate } from '../utils/formatters';

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

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  width: 150px;
`;

const ExportButtonsContainer = styled.div`
  margin-left: auto;
  display: flex;
  gap: 10px;
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ReportCard = styled(Card)`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ReportTitle = styled.h2`
  font-size: 18px;
  margin: 0;
  color: #212529;
`;

const ChartContainer = styled.div`
  flex-grow: 1;
  min-height: 300px;
  position: relative;
`;

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SummaryCard = styled(Card)`
  padding: 20px;
`;

const SummaryValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-top: 5px;
  color: ${props => props.color || '#212529'};
`;

const SummaryLabel = styled.div`
  font-size: 14px;
  color: #6c757d;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
  }
  
  th {
    background-color: #f8f9fa;
    color: #495057;
    font-weight: 600;
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
`;

const ErrorMessage = styled.div`
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #6c757d;
  
  svg {
    margin-bottom: 15px;
    font-size: 48px;
  }
`;

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [reportType, setReportType] = useState('income-expense');
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        setError('Failed to load transaction data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const filterTransactionsByDate = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the end date fully
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  };
  
  const filteredTransactions = filterTransactionsByDate();
  
  const calculateSummary = () => {
    if (filteredTransactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        averageIncome: 0,
        averageExpense: 0
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
    
    const balance = totalIncome - totalExpenses;
    
    // Calculate date range in months for averages
    const start = new Date(startDate);
    const end = new Date(endDate);
    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    
    const averageIncome = totalIncome / (monthsDiff || 1);
    const averageExpense = totalExpenses / (monthsDiff || 1);
    
    return {
      totalIncome,
      totalExpenses,
      balance,
      averageIncome,
      averageExpense
    };
  };
  
  const summary = calculateSummary();
  
  const prepareIncomeExpenseData = () => {
    if (filteredTransactions.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let dateFormat;
    let groupingFunction;
    
    switch (timeFrame) {
      case 'daily':
        dateFormat = date => formatDate(date, 'MMM d, yyyy');
        groupingFunction = date => formatDate(date, 'yyyy-MM-dd');
        break;
      case 'weekly':
        dateFormat = date => {
          const weekStart = new Date(date);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          return `${formatDate(weekStart, 'MMM d')} - ${formatDate(weekEnd, 'MMM d, yyyy')}`;
        };
        groupingFunction = date => {
          const weekStart = new Date(date);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return formatDate(weekStart, 'yyyy-MM-dd');
        };
        break;
      case 'monthly':
      default:
        dateFormat = date => formatDate(date, 'MMM yyyy');
        groupingFunction = date => formatDate(date, 'yyyy-MM');
        break;
    }
    
    // Generate all periods in the range
    const periods = [];
    let current = new Date(start);
    
    if (timeFrame === 'daily') {
      while (current <= end) {
        periods.push({
          key: groupingFunction(current),
          label: dateFormat(current),
          income: 0,
          expense: 0
        });
        current.setDate(current.getDate() + 1);
      }
    } else if (timeFrame === 'weekly') {
      // Start from the beginning of the week
      const weekStart = new Date(current);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      current = weekStart;
      
      while (current <= end) {
        periods.push({
          key: groupingFunction(current),
          label: dateFormat(current),
          income: 0,
          expense: 0
        });
        current.setDate(current.getDate() + 7);
      }
    } else { // monthly
      while (current <= end) {
        periods.push({
          key: groupingFunction(current),
          label: dateFormat(current),
          income: 0,
          expense: 0
        });
        current.setMonth(current.getMonth() + 1);
      }
    }
    
    // Map periods to an object for easier lookup
    const periodMap = periods.reduce((acc, period) => {
      acc[period.key] = period;
      return acc;
    }, {});
    
    // Aggregate transaction data
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const periodKey = groupingFunction(date);
      
      if (periodMap[periodKey]) {
        if (transaction.type === 'credit') {
          periodMap[periodKey].income += transaction.amount;
        } else {
          periodMap[periodKey].expense += transaction.amount;
        }
      }
    });
    
    return {
      labels: periods.map(period => period.label),
      datasets: [
        {
          label: 'Income',
          data: periods.map(period => period.income),
          backgroundColor: 'rgba(40, 167, 69, 0.2)',
          borderColor: '#28a745',
          borderWidth: 2,
          tension: 0.1
        },
        {
          label: 'Expenses',
          data: periods.map(period => period.expense),
          backgroundColor: 'rgba(220, 53, 69, 0.2)',
          borderColor: '#dc3545',
          borderWidth: 2,
          tension: 0.1
        }
      ]
    };
  };
  
  const prepareCategoryData = () => {
    if (filteredTransactions.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    const categoryMap = {};
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === (reportType === 'expense-categories' ? 'debit' : 'credit')) {
        const category = transaction.category || 'Uncategorized';
        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }
        categoryMap[category] += transaction.amount;
      }
    });
    
    const categories = Object.keys(categoryMap).sort((a, b) => categoryMap[b] - categoryMap[a]);
    
    // Generate colors for each category
    const backgroundColors = [
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(40, 167, 69, 0.6)',
      'rgba(220, 53, 69, 0.6)'
    ];
    
    return {
      labels: categories,
      datasets: [
        {
          data: categories.map(category => categoryMap[category]),
          backgroundColor: categories.map((_, index) => backgroundColors[index % backgroundColors.length]),
          borderWidth: 1
        }
      ]
    };
  };
  
  const incomeExpenseData = prepareIncomeExpenseData();
  const categoryData = prepareCategoryData();
  
  const exportCSV = () => {
    if (filteredTransactions.length === 0) {
      return;
    }
    
    // Prepare CSV content
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        transaction.date,
        `"${transaction.description.replace(/"/g, '""')}"`,
        transaction.category || 'Uncategorized',
        transaction.type === 'credit' ? 'Income' : 'Expense',
        transaction.amount
      ].join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-report-${startDate}-to-${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportPDF = () => {
    // In a real application, this would generate a PDF
    alert('PDF export functionality would be implemented here.');
  };
  
  if (loading) {
    return (
      <PageContainer>
        <Loader fullPage text="Loading report data..." />
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Financial Reports</PageTitle>
        <PageSubtitle>Analyze your financial data and generate reports</PageSubtitle>
      </PageHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>Report Type:</FilterLabel>
          <FilterSelect 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="income-expense">Income vs Expenses</option>
            <option value="expense-categories">Expense by Category</option>
            <option value="income-categories">Income by Category</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Time Frame:</FilterLabel>
          <FilterSelect 
            value={timeFrame} 
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </FilterSelect>
        </FilterGroup>
        
        <DateRangeContainer>
          <FilterLabel>Date Range:</FilterLabel>
          <DateInput 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>to</span>
          <DateInput 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DateRangeContainer>
        
        <ExportButtonsContainer>
          <Button 
            variant="secondary" 
            onClick={exportCSV}
            disabled={filteredTransactions.length === 0}
          >
            Export CSV
          </Button>
          <Button 
            variant="secondary" 
            onClick={exportPDF}
            disabled={filteredTransactions.length === 0}
          >
            Export PDF
          </Button>
        </ExportButtonsContainer>
      </FiltersContainer>
      
      <SummaryContainer>
        <SummaryCard>
          <SummaryLabel>Total Income</SummaryLabel>
          <SummaryValue color="#28a745">{formatCurrency(summary.totalIncome)}</SummaryValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryLabel>Total Expenses</SummaryLabel>
          <SummaryValue color="#dc3545">{formatCurrency(summary.totalExpenses)}</SummaryValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryLabel>Net Balance</SummaryLabel>
          <SummaryValue color={summary.balance >= 0 ? '#28a745' : '#dc3545'}>
            {formatCurrency(summary.balance)}
          </SummaryValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryLabel>Average Monthly Income</SummaryLabel>
          <SummaryValue color="#28a745">{formatCurrency(summary.averageIncome)}</SummaryValue>
        </SummaryCard>
        
        <SummaryCard>
          <SummaryLabel>Average Monthly Expenses</SummaryLabel>
          <SummaryValue color="#dc3545">{formatCurrency(summary.averageExpense)}</SummaryValue>
        </SummaryCard>
      </SummaryContainer>
      
      <ReportsGrid>
        {reportType === 'income-expense' ? (
          <>
            <ReportCard>
              <ReportHeader>
                <ReportTitle>Income vs Expenses</ReportTitle>
              </ReportHeader>
              <ChartContainer>
                {filteredTransactions.length > 0 ? (
                  <LineChart data={incomeExpenseData} />
                ) : (
                  <EmptyState>
                    <div>No data available for the selected period</div>
                  </EmptyState>
                )}
              </ChartContainer>
            </ReportCard>
            
            <ReportCard>
              <ReportHeader>
                <ReportTitle>Income vs Expenses</ReportTitle>
              </ReportHeader>
              <ChartContainer>
                {filteredTransactions.length > 0 ? (
                  <BarChart data={incomeExpenseData} />
                ) : (
                  <EmptyState>
                    <div>No data available for the selected period</div>
                  </EmptyState>
                )}
              </ChartContainer>
            </ReportCard>
          </>
        ) : (
          <>
            <ReportCard>
              <ReportHeader>
                <ReportTitle>
                  {reportType === 'expense-categories' ? 'Expenses by Category' : 'Income by Category'}
                </ReportTitle>
              </ReportHeader>
              <ChartContainer>
                {filteredTransactions.length > 0 && categoryData.labels.length > 0 ? (
                  <PieChart data={categoryData} />
                ) : (
                  <EmptyState>
                    <div>No data available for the selected period</div>
                  </EmptyState>
                )}
              </ChartContainer>
            </ReportCard>
            
            <ReportCard>
              <ReportHeader>
                <ReportTitle>
                  {reportType === 'expense-categories' ? 'Expenses by Category' : 'Income by Category'}
                </ReportTitle>
              </ReportHeader>
              <ChartContainer>
                {filteredTransactions.length > 0 && categoryData.labels.length > 0 ? (
                  <BarChart data={categoryData} />
                ) : (
                  <EmptyState>
                    <div>No data available for the selected period</div>
                  </EmptyState>
                )}
              </ChartContainer>
            </ReportCard>
          </>
        )}
      </ReportsGrid>
      
      <TableContainer>
        <ReportCard>
          <ReportHeader>
            <ReportTitle>Transaction Details</ReportTitle>
          </ReportHeader>
          
          {filteredTransactions.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.category || 'Uncategorized'}</td>
                    <td>{transaction.type === 'credit' ? 'Income' : 'Expense'}</td>
                    <td style={{ color: transaction.type === 'credit' ? '#28a745' : '#dc3545' }}>
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState>
              <div>No transactions found for the selected period</div>
            </EmptyState>
          )}
        </ReportCard>
      </TableContainer>
    </PageContainer>
  );
};

export default Reports;