import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const AnalysisContainer = styled(Card)`
  padding: 20px;
  margin-bottom: 20px;
`;

const AnalysisHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AnalysisTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #212529;
`;

const StockSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const StockButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: ${props => props.active ? props.color : '#f8f9fa'};
  color: ${props => props.active ? '#fff' : '#212529'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? props.color : '#e9ecef'};
  }
`;

const AnalysisContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  color: #212529;
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #dee2e6;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #212529;
`;

const AnalystRatings = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const RatingBar = styled.div`
  flex: 1;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const RatingFill = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => {
    if (props.type === 'buy') return '#28a745';
    if (props.type === 'hold') return '#ffc107';
    return '#dc3545';
  }};
`;

const RatingLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  width: 50px;
  color: ${props => {
    if (props.type === 'buy') return '#28a745';
    if (props.type === 'hold') return '#ffc107';
    return '#dc3545';
  }};
`;

const RatingPercentage = styled.div`
  font-size: 14px;
  font-weight: 500;
  width: 40px;
  text-align: right;
`;

const KeyStatsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
`;

const KeyStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const KeyStatLabel = styled.div`
  font-size: 14px;
  color: #6c757d;
`;

const KeyStatValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #212529;
`;

const EarningsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  font-size: 14px;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
`;

const TableCell = styled.td`
  padding: 10px;
  font-size: 14px;
  border-bottom: 1px solid #dee2e6;
  color: ${props => props.highlight ? (props.positive ? '#28a745' : '#dc3545') : '#212529'};
`;

// Stock company names
const STOCK_NAMES = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corp.',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'META': 'Meta Platforms Inc.'
};

// Stock chart colors
const STOCK_COLORS = {
  'AAPL': '#007bff',
  'MSFT': '#28a745',
  'GOOGL': '#dc3545',
  'AMZN': '#fd7e14',
  'META': '#6f42c1'
};

// Mock data for market analysis
const MARKET_ANALYSIS_DATA = {
  'AAPL': {
    companyInfo: {
      founded: '1976',
      headquarters: 'Cupertino, California',
      ceo: 'Tim Cook',
      employees: '164,000',
      sector: 'Technology',
      industry: 'Consumer Electronics'
    },
    financials: {
      marketCap: '2.7T',
      peRatio: '28.72',
      eps: '6.14',
      dividend: '0.96',
      dividendYield: '0.55%',
      revenue: '383.29B',
      revenueGrowth: '6.71%',
      profitMargin: '25.31%'
    },
    analystRatings: {
      buy: 70,
      hold: 20,
      sell: 10,
      targetPrice: '210.50',
      currentPrice: '173.72'
    },
    keyStats: {
      beta: '1.28',
      avgVolume: '59.3M',
      dayRange: '171.96 - 175.10',
      yearRange: '124.17 - 178.72',
      roe: '160.09%',
      debtToEquity: '1.73',
      currentRatio: '0.99',
      quickRatio: '0.92'
    },
    earnings: [
      { quarter: 'Q1 2024', date: 'Feb 1, 2024', epsEstimate: '2.10', epsActual: '2.18', revenue: '119.6B', revenueGrowth: '2.1%', surprise: '+3.8%' },
      { quarter: 'Q4 2023', date: 'Nov 2, 2023', epsEstimate: '1.39', epsActual: '1.46', revenue: '89.5B', revenueGrowth: '-1.0%', surprise: '+5.0%' },
      { quarter: 'Q3 2023', date: 'Aug 3, 2023', epsEstimate: '1.19', epsActual: '1.26', revenue: '81.8B', revenueGrowth: '-1.4%', surprise: '+5.9%' },
      { quarter: 'Q2 2023', date: 'May 4, 2023', epsEstimate: '1.43', epsActual: '1.52', revenue: '94.8B', revenueGrowth: '-2.5%', surprise: '+6.3%' }
    ]
  },
  'MSFT': {
    companyInfo: {
      founded: '1975',
      headquarters: 'Redmond, Washington',
      ceo: 'Satya Nadella',
      employees: '221,000',
      sector: 'Technology',
      industry: 'Software—Infrastructure'
    },
    financials: {
      marketCap: '3.1T',
      peRatio: '35.97',
      eps: '11.14',
      dividend: '3.00',
      dividendYield: '0.72%',
      revenue: '211.92B',
      revenueGrowth: '16.65%',
      profitMargin: '34.15%'
    },
    analystRatings: {
      buy: 85,
      hold: 12,
      sell: 3,
      targetPrice: '450.00',
      currentPrice: '417.88'
    },
    keyStats: {
      beta: '0.89',
      avgVolume: '22.1M',
      dayRange: '415.32 - 420.82',
      yearRange: '275.37 - 430.82',
      roe: '38.94%',
      debtToEquity: '0.35',
      currentRatio: '1.66',
      quickRatio: '1.53'
    },
    earnings: [
      { quarter: 'Q2 2024', date: 'Jan 30, 2024', epsEstimate: '2.76', epsActual: '2.93', revenue: '62.0B', revenueGrowth: '17.6%', surprise: '+6.2%' },
      { quarter: 'Q1 2024', date: 'Oct 24, 2023', epsEstimate: '2.65', epsActual: '2.99', revenue: '56.5B', revenueGrowth: '12.8%', surprise: '+12.8%' },
      { quarter: 'Q4 2023', date: 'Jul 25, 2023', epsEstimate: '2.55', epsActual: '2.69', revenue: '56.2B', revenueGrowth: '8.3%', surprise: '+5.5%' },
      { quarter: 'Q3 2023', date: 'Apr 25, 2023', epsEstimate: '2.23', epsActual: '2.45', revenue: '52.9B', revenueGrowth: '7.1%', surprise: '+9.9%' }
    ]
  },
  'GOOGL': {
    companyInfo: {
      founded: '1998',
      headquarters: 'Mountain View, California',
      ceo: 'Sundar Pichai',
      employees: '182,000',
      sector: 'Technology',
      industry: 'Internet Content & Information'
    },
    financials: {
      marketCap: '1.9T',
      peRatio: '25.42',
      eps: '5.80',
      dividend: '0.00',
      dividendYield: '0.00%',
      revenue: '307.39B',
      revenueGrowth: '13.49%',
      profitMargin: '24.01%'
    },
    analystRatings: {
      buy: 75,
      hold: 20,
      sell: 5,
      targetPrice: '180.00',
      currentPrice: '147.60'
    },
    keyStats: {
      beta: '1.05',
      avgVolume: '23.5M',
      dayRange: '146.25 - 149.10',
      yearRange: '102.63 - 155.74',
      roe: '25.33%',
      debtToEquity: '0.06',
      currentRatio: '2.10',
      quickRatio: '1.95'
    },
    earnings: [
      { quarter: 'Q4 2023', date: 'Jan 30, 2024', epsEstimate: '1.59', epsActual: '1.64', revenue: '86.3B', revenueGrowth: '13.5%', surprise: '+3.1%' },
      { quarter: 'Q3 2023', date: 'Oct 24, 2023', epsEstimate: '1.45', epsActual: '1.55', revenue: '76.7B', revenueGrowth: '11.0%', surprise: '+6.9%' },
      { quarter: 'Q2 2023', date: 'Jul 25, 2023', epsEstimate: '1.34', epsActual: '1.44', revenue: '74.6B', revenueGrowth: '7.1%', surprise: '+7.5%' },
      { quarter: 'Q1 2023', date: 'Apr 25, 2023', epsEstimate: '1.07', epsActual: '1.17', revenue: '69.8B', revenueGrowth: '2.6%', surprise: '+9.3%' }
    ]
  },
  'AMZN': {
    companyInfo: {
      founded: '1994',
      headquarters: 'Seattle, Washington',
      ceo: 'Andy Jassy',
      employees: '1,525,000',
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail'
    },
    financials: {
      marketCap: '1.85T',
      peRatio: '61.64',
      eps: '2.90',
      dividend: '0.00',
      dividendYield: '0.00%',
      revenue: '574.78B',
      revenueGrowth: '11.97%',
      profitMargin: '5.29%'
    },
    analystRatings: {
      buy: 80,
      hold: 15,
      sell: 5,
      targetPrice: '200.00',
      currentPrice: '178.75'
    },
    keyStats: {
      beta: '1.16',
      avgVolume: '43.2M',
      dayRange: '176.50 - 180.14',
      yearRange: '101.15 - 180.14',
      roe: '16.09%',
      debtToEquity: '0.39',
      currentRatio: '1.05',
      quickRatio: '0.82'
    },
    earnings: [
      { quarter: 'Q4 2023', date: 'Feb 1, 2024', epsEstimate: '0.80', epsActual: '1.00', revenue: '169.9B', revenueGrowth: '13.9%', surprise: '+25.0%' },
      { quarter: 'Q3 2023', date: 'Oct 26, 2023', epsEstimate: '0.58', epsActual: '0.94', revenue: '143.1B', revenueGrowth: '12.6%', surprise: '+62.1%' },
      { quarter: 'Q2 2023', date: 'Aug 3, 2023', epsEstimate: '0.35', epsActual: '0.65', revenue: '134.4B', revenueGrowth: '10.9%', surprise: '+85.7%' },
      { quarter: 'Q1 2023', date: 'Apr 27, 2023', epsEstimate: '0.21', epsActual: '0.31', revenue: '127.4B', revenueGrowth: '9.4%', surprise: '+47.6%' }
    ]
  },
  'META': {
    companyInfo: {
      founded: '2004',
      headquarters: 'Menlo Park, California',
      ceo: 'Mark Zuckerberg',
      employees: '67,317',
      sector: 'Technology',
      industry: 'Internet Content & Information'
    },
    financials: {
      marketCap: '1.24T',
      peRatio: '28.13',
      eps: '17.19',
      dividend: '0.00',
      dividendYield: '0.00%',
      revenue: '134.90B',
      revenueGrowth: '15.72%',
      profitMargin: '32.37%'
    },
    analystRatings: {
      buy: 78,
      hold: 17,
      sell: 5,
      targetPrice: '520.00',
      currentPrice: '485.58'
    },
    keyStats: {
      beta: '1.21',
      avgVolume: '15.8M',
      dayRange: '482.12 - 489.25',
      yearRange: '197.90 - 523.57',
      roe: '29.46%',
      debtToEquity: '0.12',
      currentRatio: '2.67',
      quickRatio: '2.57'
    },
    earnings: [
      { quarter: 'Q4 2023', date: 'Feb 1, 2024', epsEstimate: '4.96', epsActual: '5.33', revenue: '40.1B', revenueGrowth: '24.7%', surprise: '+7.5%' },
      { quarter: 'Q3 2023', date: 'Oct 25, 2023', epsEstimate: '3.63', epsActual: '4.39', revenue: '34.1B', revenueGrowth: '23.2%', surprise: '+20.9%' },
      { quarter: 'Q2 2023', date: 'Jul 26, 2023', epsEstimate: '2.91', epsActual: '3.03', revenue: '32.0B', revenueGrowth: '11.0%', surprise: '+4.1%' },
      { quarter: 'Q1 2023', date: 'Apr 26, 2023', epsEstimate: '2.03', epsActual: '2.20', revenue: '28.6B', revenueGrowth: '2.6%', surprise: '+8.4%' }
    ]
  }
};

/**
 * Component for displaying detailed market analysis for selected stocks
 * @returns {React.ReactElement} MarketAnalysis component
 */
const MarketAnalysis = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  
  const stockData = MARKET_ANALYSIS_DATA[selectedStock];
  
  const handleStockSelect = (symbol) => {
    setSelectedStock(symbol);
  };
  
  return (
    <AnalysisContainer>
      <AnalysisHeader>
        <AnalysisTitle>Market Analysis</AnalysisTitle>
      </AnalysisHeader>
      
      <StockSelector>
        {Object.keys(STOCK_NAMES).map(symbol => (
          <StockButton 
            key={symbol}
            active={selectedStock === symbol}
            color={STOCK_COLORS[symbol]}
            onClick={() => handleStockSelect(symbol)}
          >
            {symbol} - {STOCK_NAMES[symbol]}
          </StockButton>
        ))}
      </StockSelector>
      
      <AnalysisContent>
        {/* Company Information */}
        <div>
          <SectionTitle>Company Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Founded</InfoLabel>
              <InfoValue>{stockData.companyInfo.founded}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Headquarters</InfoLabel>
              <InfoValue>{stockData.companyInfo.headquarters}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>CEO</InfoLabel>
              <InfoValue>{stockData.companyInfo.ceo}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Employees</InfoLabel>
              <InfoValue>{stockData.companyInfo.employees}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Sector</InfoLabel>
              <InfoValue>{stockData.companyInfo.sector}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Industry</InfoLabel>
              <InfoValue>{stockData.companyInfo.industry}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </div>
        
        {/* Financial Information */}
        <div>
          <SectionTitle>Financial Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Market Cap</InfoLabel>
              <InfoValue>{stockData.financials.marketCap}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>P/E Ratio</InfoLabel>
              <InfoValue>{stockData.financials.peRatio}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>EPS</InfoLabel>
              <InfoValue>{stockData.financials.eps}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Dividend</InfoLabel>
              <InfoValue>{stockData.financials.dividend}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Dividend Yield</InfoLabel>
              <InfoValue>{stockData.financials.dividendYield}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Revenue</InfoLabel>
              <InfoValue>{stockData.financials.revenue}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Revenue Growth</InfoLabel>
              <InfoValue>{stockData.financials.revenueGrowth}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Profit Margin</InfoLabel>
              <InfoValue>{stockData.financials.profitMargin}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </div>
        
        {/* Analyst Ratings */}
        <div>
          <SectionTitle>Analyst Ratings</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Target Price</InfoLabel>
              <InfoValue>{formatCurrency(parseFloat(stockData.analystRatings.targetPrice))}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Current Price</InfoLabel>
              <InfoValue>{formatCurrency(parseFloat(stockData.analystRatings.currentPrice))}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Upside Potential</InfoLabel>
              <InfoValue>
                {(((parseFloat(stockData.analystRatings.targetPrice) / parseFloat(stockData.analystRatings.currentPrice)) - 1) * 100).toFixed(2)}%
              </InfoValue>
            </InfoItem>
          </InfoGrid>
          
          <AnalystRatings>
            <RatingLabel type="buy">Buy</RatingLabel>
            <RatingBar>
              <RatingFill type="buy" percentage={stockData.analystRatings.buy} />
            </RatingBar>
            <RatingPercentage>{stockData.analystRatings.buy}%</RatingPercentage>
          </AnalystRatings>
          
          <AnalystRatings>
            <RatingLabel type="hold">Hold</RatingLabel>
            <RatingBar>
              <RatingFill type="hold" percentage={stockData.analystRatings.hold} />
            </RatingBar>
            <RatingPercentage>{stockData.analystRatings.hold}%</RatingPercentage>
          </AnalystRatings>
          
          <AnalystRatings>
            <RatingLabel type="sell">Sell</RatingLabel>
            <RatingBar>
              <RatingFill type="sell" percentage={stockData.analystRatings.sell} />
            </RatingBar>
            <RatingPercentage>{stockData.analystRatings.sell}%</RatingPercentage>
          </AnalystRatings>
        </div>
        
        {/* Key Statistics */}
        <div>
          <SectionTitle>Key Statistics</SectionTitle>
          <KeyStatsList>
            <KeyStatItem>
              <KeyStatLabel>Beta</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.beta}</KeyStatValue>
            </KeyStatItem>
            <KeyStatItem>
              <KeyStatLabel>Avg. Volume</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.avgVolume}</KeyStatValue>
            </KeyStatItem>
            <KeyStatItem>
              <KeyStatLabel>Day Range</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.dayRange}</KeyStatValue>
            </KeyStatItem>
            <KeyStatItem>
              <KeyStatLabel>52-Week Range</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.yearRange}</KeyStatValue>
            </KeyStatItem>
            <KeyStatItem>
              <KeyStatLabel>Return on Equity</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.roe}</KeyStatValue>
            </KeyStatItem>
            <KeyStatItem>
              <KeyStatLabel>Debt to Equity</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.debtToEquity}</KeyStatValue>
            </KeyStatItem>
            <KeyStatItem>
              <KeyStatLabel>Current Ratio</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.currentRatio}</KeyStatValue>
            </KeyStatItem>
            <KeyStatItem>
              <KeyStatLabel>Quick Ratio</KeyStatLabel>
              <KeyStatValue>{stockData.keyStats.quickRatio}</KeyStatValue>
            </KeyStatItem>
          </KeyStatsList>
        </div>
        
        {/* Earnings Reports */}
        <div>
          <SectionTitle>Recent Earnings Reports</SectionTitle>
          <EarningsTable>
            <TableHead>
              <TableRow>
                <TableHeader>Quarter</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>EPS Est.</TableHeader>
                <TableHeader>EPS Actual</TableHeader>
                <TableHeader>Revenue</TableHeader>
                <TableHeader>YoY Growth</TableHeader>
                <TableHeader>Surprise</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {stockData.earnings.map((earning, index) => (
                <TableRow key={index}>
                  <TableCell>{earning.quarter}</TableCell>
                  <TableCell>{earning.date}</TableCell>
                  <TableCell>{earning.epsEstimate}</TableCell>
                  <TableCell>{earning.epsActual}</TableCell>
                  <TableCell>{earning.revenue}</TableCell>
                  <TableCell 
                    highlight 
                    positive={parseFloat(earning.revenueGrowth) > 0}
                  >
                    {earning.revenueGrowth}
                  </TableCell>
                  <TableCell 
                    highlight 
                    positive={parseFloat(earning.surprise) > 0}
                  >
                    {earning.surprise}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </EarningsTable>
        </div>
      </AnalysisContent>
    </AnalysisContainer>
  );
};

export default MarketAnalysis; 