import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import { fetchMultipleStocks, fetchMultipleHistoricalData } from '../../services/stockApi';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const TrendsContainer = styled(Card)`
  padding: 24px;
  margin-bottom: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
`;

const TrendsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
`;

const TrendsTitle = styled.h3`
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

const ChartContainer = styled.div`
  height: 450px;
  margin-bottom: 24px;
  position: relative;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
`;

const ChartWrapper = styled.div`
  flex: 1;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const StockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StockCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
  
  ${props => props.active && `
    border: 2px solid ${props.color || '#007bff'};
    background: linear-gradient(to bottom right, white, ${props.color}08);
    box-shadow: 0 8px 16px ${props.color}15;
  `}
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StockSymbol = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #212529;
`;

const StockName = styled.div`
  font-size: 12px;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StockPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-top: 5px;
`;

const StockChange = styled.div`
  font-size: 14px;
  margin-top: 5px;
  color: ${props => props.isPositive ? '#28a745' : '#dc3545'};
  display: flex;
  align-items: center;
`;

const StockVolume = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #6c757d;
  font-size: 16px;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const ChartPath = styled.path`
  fill: none;
  stroke: ${props => props.color || '#007bff'};
  stroke-width: 2;
  transition: opacity 0.3s;
  
  &:hover {
    stroke-width: 3;
  }
`;

const ChartArea = styled.path`
  fill: ${props => props.color || 'rgba(0, 123, 255, 0.1)'};
  opacity: 0.2;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.3;
  }
`;

const ChartAxis = styled.line`
  stroke: #dee2e6;
  stroke-width: 1;
`;

const ChartLabel = styled.text`
  font-size: 10px;
  fill: #6c757d;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  flex-wrap: wrap;
  gap: 15px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.active ? `${props.color}20` : 'transparent'};
  border: 1px solid ${props => props.active ? props.color : 'transparent'};
  
  &:hover {
    background-color: ${props => `${props.color}10`};
  }
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 5px;
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 100;
  font-size: 12px;
  max-width: 200px;
  opacity: ${props => props.visible ? 1 : 0};
  transform: translate(-50%, -100%);
  transition: opacity 0.2s;
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: #212529;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  
  & > span:first-child {
    margin-right: 10px;
    color: #6c757d;
  }
  
  & > span:last-child {
    font-weight: 500;
    color: ${props => props.color || '#212529'};
  }
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

/**
 * Component for displaying market trends and stock data
 * @returns {React.ReactElement} MarketTrends component
 */
const MarketTrends = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [historicalData, setHistoricalData] = useState({});
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    date: '',
    stocks: []
  });
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  
  const chartRef = useRef(null);
  
  // List of stock symbols to display
  const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];
  
  // Add a resize handler to update chart dimensions when window size changes
  useEffect(() => {
    const updateChartSize = () => {
      if (chartRef.current) {
        setChartSize({
          width: chartRef.current.clientWidth - 32, // Subtract padding
          height: chartRef.current.clientHeight - 32 // Subtract padding
        });
      }
    };
    
    // Initial size calculation
    updateChartSize();
    
    // Add resize listener
    window.addEventListener('resize', updateChartSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateChartSize);
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch current stock data
        const stocksData = await fetchMultipleStocks(stockSymbols);
        setStocks(stocksData);
        
        // Set the first stock as selected by default
        if (selectedStocks.length === 0) {
          setSelectedStocks([stocksData[0].symbol]);
        }
        
        // Fetch historical data for all stocks
        const historical = await fetchMultipleHistoricalData(stockSymbols);
        setHistoricalData(historical);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to load market data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Helper function to generate fallback data
  const generateFallbackData = (symbol) => {
    const fallbackData = [];
    const today = new Date();
    
    // Ensure we have a consistent 30-day range for all stocks
    // Start from 30 days ago and go up to today
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);
    
    // Current prices as of March 17, 2024
    const currentPrices = {
      'AAPL': 173.72,
      'MSFT': 417.88,
      'GOOGL': 147.60,
      'AMZN': 178.75,
      'META': 485.58
    };
    
    // Base price for the stock
    const basePrice = currentPrices[symbol] || 100.00;
    
    // Generate data for each day in the range
    for (let i = 0; i <= 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate some random but somewhat realistic looking data
      // The closer to today, the closer to the current price
      const daysFactor = i / 30; // 0 to 1 factor based on how close to today
      const volatility = 0.015; // 1.5% max daily change
      
      // Start from a price 5-10% different from current price and move toward current price
      const startingDiff = (Math.random() * 0.05 + 0.05) * (Math.random() > 0.5 ? 1 : -1);
      const startingPrice = basePrice * (1 + startingDiff);
      
      // Interpolate between starting price and current price
      const trendPrice = startingPrice + (basePrice - startingPrice) * daysFactor;
      
      // Add some daily randomness
      const dailyChange = basePrice * volatility * (Math.random() * 2 - 1);
      const close = trendPrice + dailyChange;
      
      fallbackData.push({
        date: dateStr,
        open: close * (1 + (Math.random() * 0.01 - 0.005)), // Within 0.5% of close
        high: close * (1 + (Math.random() * 0.02)), // Up to 2% higher than close
        low: close * (1 - (Math.random() * 0.02)), // Up to 2% lower than close
        close,
        volume: Math.floor(Math.random() * 10000000 + 5000000) // More realistic volume
      });
    }
    
    return fallbackData;
  };
  
  const handleStockSelect = (symbol) => {
    setSelectedStocks(prev => {
      // If already selected, remove it (unless it's the only one selected)
      if (prev.includes(symbol) && prev.length > 1) {
        return prev.filter(s => s !== symbol);
      }
      // If not selected, add it
      else if (!prev.includes(symbol)) {
        return [...prev, symbol];
      }
      // If it's the only one and selected, keep it
      return prev;
    });
  };
  
  const handleLegendClick = (symbol) => {
    handleStockSelect(symbol);
  };
  
  // Prepare chart data for the selected stocks
  const prepareChartData = () => {
    if (selectedStocks.length === 0 || !Object.keys(historicalData).length) {
      return null;
    }
    
    // Find min and max values across all selected stocks
    let minValue = Number.MAX_VALUE;
    let maxValue = Number.MIN_VALUE;
    let allDates = new Set();
    
    // First pass: collect all dates and find min/max values
    selectedStocks.forEach(symbol => {
      if (!historicalData[symbol]) return;
      
      historicalData[symbol].forEach(item => {
        allDates.add(item.date);
        minValue = Math.min(minValue, item.low);
        maxValue = Math.max(maxValue, item.high);
      });
    });
    
    // Sort dates and ensure we have a consistent range
    const sortedDates = Array.from(allDates).sort();
    
    // If we have dates, ensure we have a consistent range
    if (sortedDates.length > 0) {
      // Get the earliest and latest dates from all stocks
      const earliestDate = sortedDates[0];
      const latestDate = sortedDates[sortedDates.length - 1];
      
      // Fill in any missing dates in the range
      const startDate = new Date(earliestDate);
      const endDate = new Date(latestDate);
      const dateRange = [];
      
      // Generate all dates in the range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dateRange.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Use the complete date range
      sortedDates.length = 0;
      sortedDates.push(...dateRange);
    }
    
    // Add some padding to the min/max
    const padding = (maxValue - minValue) * 0.1;
    minValue -= padding;
    maxValue += padding;
    
    // Chart dimensions - use dynamic values from state or fallback to defaults
    const width = chartSize.width || (chartRef.current ? chartRef.current.clientWidth - 32 : 800);
    const height = chartSize.height || (chartRef.current ? chartRef.current.clientHeight - 32 : 400);
    const padding_x = 50;
    const padding_y = 40;
    
    // Calculate x and y scales
    const xScale = (width - 2 * padding_x) / (sortedDates.length - 1);
    const yScale = (height - 2 * padding_y) / (maxValue - minValue);
    
    // Generate paths for each selected stock
    const paths = {};
    
    selectedStocks.forEach(symbol => {
      if (!historicalData[symbol]) return;
      
      // Create a map of date to data point for this stock
      const dateMap = {};
      historicalData[symbol].forEach(item => {
        dateMap[item.date] = item;
      });
      
      let linePath = '';
      let areaPath = '';
      
      // Generate the path using all dates
      sortedDates.forEach((date, index) => {
        const x = padding_x + index * xScale;
        
        // If we have data for this date, use it
        if (dateMap[date]) {
          const y = height - padding_y - (dateMap[date].close - minValue) * yScale;
          
          if (index === 0 || !linePath) {
            linePath += `M ${x} ${y}`;
            areaPath += `M ${x} ${height - padding_y} L ${x} ${y}`;
          } else {
            linePath += ` L ${x} ${y}`;
            areaPath += ` L ${x} ${y}`;
          }
        }
        // If we don't have data for this date, interpolate
        else if (linePath) {
          // Find the next available date
          let nextDate = null;
          let nextValue = null;
          
          for (let i = index + 1; i < sortedDates.length; i++) {
            if (dateMap[sortedDates[i]]) {
              nextDate = sortedDates[i];
              nextValue = dateMap[sortedDates[i]].close;
              break;
            }
          }
          
          // Find the previous available date
          let prevDate = null;
          let prevValue = null;
          
          for (let i = index - 1; i >= 0; i--) {
            if (dateMap[sortedDates[i]]) {
              prevDate = sortedDates[i];
              prevValue = dateMap[sortedDates[i]].close;
              break;
            }
          }
          
          // If we have both previous and next, interpolate
          if (prevDate && nextDate) {
            const prevIndex = sortedDates.indexOf(prevDate);
            const nextIndex = sortedDates.indexOf(nextDate);
            const ratio = (index - prevIndex) / (nextIndex - prevIndex);
            const interpolatedValue = prevValue + (nextValue - prevValue) * ratio;
            
            const y = height - padding_y - (interpolatedValue - minValue) * yScale;
            linePath += ` L ${x} ${y}`;
            areaPath += ` L ${x} ${y}`;
          }
        }
        
        // Close the area path at the end
        if (index === sortedDates.length - 1) {
          areaPath += ` L ${x} ${height - padding_y} Z`;
        }
      });
      
      paths[symbol] = { linePath, areaPath };
    });
    
    // Generate x-axis labels (show every 5th day)
    const xLabels = sortedDates
      .filter((_, index) => index % 5 === 0 || index === sortedDates.length - 1)
      .map((date, index, filtered) => {
        const dataIndex = sortedDates.indexOf(date);
        const x = padding_x + dataIndex * xScale;
        const dateObj = new Date(date);
        const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        
        return {
          x,
          y: height - padding_y + 15,
          label,
          date
        };
      });
    
    // Generate y-axis labels
    const yLabels = [];
    const numYLabels = 5;
    
    for (let i = 0; i < numYLabels; i++) {
      const value = minValue + (maxValue - minValue) * (i / (numYLabels - 1));
      yLabels.push({
        x: padding_x - 10,
        y: height - padding_y - (value - minValue) * yScale,
        label: formatNumber(value, 2)
      });
    }
    
    // Create data points for tooltip
    const dataPoints = {};
    
    selectedStocks.forEach(symbol => {
      if (!historicalData[symbol]) return;
      
      dataPoints[symbol] = {};
      
      // Create a map of date to data point for this stock
      historicalData[symbol].forEach(item => {
        const date = item.date;
        const dataIndex = sortedDates.indexOf(date);
        
        if (dataIndex >= 0) {
          const x = padding_x + dataIndex * xScale;
          const y = height - padding_y - (item.close - minValue) * yScale;
          
          dataPoints[symbol][date] = {
            x,
            y,
            ...item
          };
        }
      });
    });
    
    return {
      paths,
      xLabels,
      yLabels,
      dataPoints,
      sortedDates,
      minValue,
      maxValue,
      width,
      height,
      padding_x,
      padding_y,
      xScale,
      yScale
    };
  };
  
  const chartData = prepareChartData();
  
  // Format volume number with K, M, B suffixes
  const formatVolume = (volume) => {
    if (volume >= 1e9) {
      return (volume / 1e9).toFixed(1) + 'B';
    } else if (volume >= 1e6) {
      return (volume / 1e6).toFixed(1) + 'M';
    } else if (volume >= 1e3) {
      return (volume / 1e3).toFixed(1) + 'K';
    }
    return volume.toString();
  };
  
  // Handle mouse move over chart
  const handleMouseMove = (e) => {
    if (!chartRef.current || !chartData) return;
    
    const chartRect = chartRef.current.getBoundingClientRect();
    const mouseX = e.clientX - chartRect.left;
    const mouseY = e.clientY - chartRect.top;
    
    // Find the closest date
    const chartX = mouseX;
    const dateIndex = Math.round((chartX - chartData.padding_x) / chartData.xScale);
    
    if (dateIndex >= 0 && dateIndex < chartData.sortedDates.length) {
      const date = chartData.sortedDates[dateIndex];
      
      // Collect data for all selected stocks on this date
      const stockData = [];
      
      selectedStocks.forEach(symbol => {
        if (chartData.dataPoints[symbol] && chartData.dataPoints[symbol][date]) {
          stockData.push({
            symbol,
            name: STOCK_NAMES[symbol] || symbol,
            color: STOCK_COLORS[symbol],
            ...chartData.dataPoints[symbol][date]
          });
        }
      });
      
      if (stockData.length > 0) {
        // Position tooltip
        const tooltipX = chartData.padding_x + dateIndex * chartData.xScale;
        
        setTooltip({
          visible: true,
          x: tooltipX,
          y: Math.min(...stockData.map(s => s.y)) - 10,
          date,
          stocks: stockData
        });
        
        return;
      }
    }
    
    // Hide tooltip if no data found
    setTooltip(prev => ({ ...prev, visible: false }));
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };
  
  if (error) {
    return (
      <TrendsContainer>
        <TrendsHeader>
          <TrendsTitle>Market Trends</TrendsTitle>
        </TrendsHeader>
        <NoDataMessage>
          {error}
        </NoDataMessage>
      </TrendsContainer>
    );
  }

  return (
    <TrendsContainer>
      <TrendsHeader>
        <TrendsTitle>Market Trends</TrendsTitle>
      </TrendsHeader>
      
      <StockGrid>
        {stocks.map((stock) => (
          <StockCard 
            key={stock.symbol} 
            active={selectedStocks.includes(stock.symbol)}
            color={STOCK_COLORS[stock.symbol]}
            onClick={() => handleStockSelect(stock.symbol)}
          >
            <StockHeader>
              <StockSymbol>{stock.symbol}</StockSymbol>
              <StockName>{STOCK_NAMES[stock.symbol] || 'Unknown'}</StockName>
            </StockHeader>
            <StockPrice>{formatCurrency(stock.price)}</StockPrice>
            <StockChange isPositive={stock.change > 0}>
              {stock.change > 0 ? '↑' : '↓'} {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
            </StockChange>
            <StockVolume>Vol: {formatVolume(stock.volume)}</StockVolume>
          </StockCard>
        ))}
      </StockGrid>
      
      <ChartContainer 
        ref={chartRef}
      >
        {loading && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}
        
        {chartData ? (
          <>
            <ChartWrapper
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <ChartSvg viewBox={`0 0 ${chartData.width} ${chartData.height}`}>
                {/* X-axis */}
                <ChartAxis 
                  x1={chartData.padding_x} 
                  y1={chartData.height - chartData.padding_y} 
                  x2={chartData.width - chartData.padding_x} 
                  y2={chartData.height - chartData.padding_y} 
                />
                
                {/* Y-axis */}
                <ChartAxis 
                  x1={chartData.padding_x} 
                  y1={chartData.padding_y} 
                  x2={chartData.padding_x} 
                  y2={chartData.height - chartData.padding_y} 
                />
                
                {/* X-axis labels */}
                {chartData.xLabels.map((label, index) => (
                  <ChartLabel key={`x-${index}`} x={label.x} y={label.y} textAnchor="middle">
                    {label.label}
                  </ChartLabel>
                ))}
                
                {/* Y-axis labels */}
                {chartData.yLabels.map((label, index) => (
                  <ChartLabel key={`y-${index}`} x={label.x} y={label.y} textAnchor="end" dominantBaseline="middle">
                    {label.label}
                  </ChartLabel>
                ))}
                
                {/* Chart areas and lines for each selected stock */}
                {selectedStocks.map(symbol => (
                  chartData.paths[symbol] && (
                    <g key={`chart-${symbol}`}>
                      <ChartArea 
                        d={chartData.paths[symbol].areaPath} 
                        color={STOCK_COLORS[symbol]}
                      />
                      <ChartPath 
                        d={chartData.paths[symbol].linePath} 
                        color={STOCK_COLORS[symbol]}
                      />
                    </g>
                  )
                ))}
              </ChartSvg>
              
              {/* Tooltip */}
              <Tooltip 
                visible={tooltip.visible} 
                style={{ 
                  left: `${tooltip.x}px`, 
                  top: `${tooltip.y}px` 
                }}
              >
                {tooltip.visible && (
                  <>
                    <TooltipTitle>
                      {new Date(tooltip.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </TooltipTitle>
                    
                    {tooltip.stocks.map(stock => (
                      <div key={`tooltip-${stock.symbol}`}>
                        <TooltipRow color={stock.color}>
                          <span>{stock.name}</span>
                          <span>{formatCurrency(stock.close)}</span>
                        </TooltipRow>
                      </div>
                    ))}
                  </>
                )}
              </Tooltip>
            </ChartWrapper>
            
            <ChartLegend>
              {selectedStocks.map(symbol => (
                <LegendItem 
                  key={`legend-${symbol}`}
                  color={STOCK_COLORS[symbol]}
                  active={true}
                  onClick={() => handleLegendClick(symbol)}
                >
                  <LegendColor color={STOCK_COLORS[symbol]} />
                  {STOCK_NAMES[symbol] || symbol}
                </LegendItem>
              ))}
            </ChartLegend>
          </>
        ) : (
          <NoDataMessage>
            No chart data available
          </NoDataMessage>
        )}
      </ChartContainer>
    </TrendsContainer>
  );
};

export default MarketTrends; 