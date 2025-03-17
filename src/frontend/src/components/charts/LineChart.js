import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoDataMessage = styled.div`
  text-align: center;
  color: #6c757d;
  font-size: 14px;
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  font-size: 12px;
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 5px;
`;

/**
 * A simple line chart component
 * @param {Object} props - Component props
 * @param {Object} props.data - Chart data with labels and datasets
 * @returns {React.ReactElement} LineChart component
 */
const LineChart = ({ data }) => {
  // Check if we have valid data to display
  const hasData = data && 
                 data.labels && 
                 data.labels.length > 0 && 
                 data.datasets && 
                 data.datasets.length > 0 &&
                 data.datasets[0].data &&
                 data.datasets[0].data.length > 0;

  if (!hasData) {
    return (
      <ChartContainer>
        <NoDataMessage>No chart data available</NoDataMessage>
      </ChartContainer>
    );
  }

  // In a real implementation, this would use a charting library
  // For now, we'll just render a mock SVG
  return (
    <ChartContainer>
      <Canvas>
        <svg width="100%" height="100%" viewBox="0 0 800 300">
          {/* Mock line chart */}
          <path
            d="M50,250 L150,180 L250,220 L350,100 L450,150 L550,80 L650,120 L750,50"
            fill="none"
            stroke="#007bff"
            strokeWidth="3"
          />
          <path
            d="M50,250 L150,220 L250,240 L350,180 L450,200 L550,150 L650,190 L750,120"
            fill="none"
            stroke="#28a745"
            strokeWidth="3"
          />
          
          {/* X-axis */}
          <line x1="50" y1="250" x2="750" y2="250" stroke="#dee2e6" strokeWidth="1" />
          
          {/* Y-axis */}
          <line x1="50" y1="50" x2="50" y2="250" stroke="#dee2e6" strokeWidth="1" />
        </svg>
      </Canvas>
      
      <Legend>
        {data.datasets.map((dataset, index) => (
          <LegendItem key={index}>
            <LegendColor color={dataset.borderColor} />
            {dataset.label}
          </LegendItem>
        ))}
      </Legend>
    </ChartContainer>
  );
};

export default LineChart; 