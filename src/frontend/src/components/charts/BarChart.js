import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const ChartCanvas = styled.div`
  flex-grow: 1;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ChartMessage = styled.div`
  color: #6c757d;
  text-align: center;
  font-size: 14px;
`;

const ChartLegend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  gap: 20px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
  background-color: ${props => props.color};
`;

/**
 * A simple bar chart component
 * In a real application, this would use a charting library like Chart.js or Recharts
 */
const BarChart = ({ data }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <ChartContainer>
        <ChartCanvas>
          <ChartMessage>No data available</ChartMessage>
        </ChartCanvas>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartCanvas>
        <ChartMessage>
          This is a placeholder for a bar chart. In a real application, this would render an actual chart using a library like Chart.js or Recharts.
        </ChartMessage>
        
        {/* Mock chart visualization */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            opacity: 0.5 
          }}
        >
          {/* Mock bars */}
          <rect x="50" y="150" width="30" height="150" fill="rgba(40, 167, 69, 0.6)" />
          <rect x="90" y="180" width="30" height="120" fill="rgba(40, 167, 69, 0.6)" />
          <rect x="130" y="120" width="30" height="180" fill="rgba(40, 167, 69, 0.6)" />
          <rect x="170" y="100" width="30" height="200" fill="rgba(40, 167, 69, 0.6)" />
          <rect x="210" y="80" width="30" height="220" fill="rgba(40, 167, 69, 0.6)" />
          
          {data.datasets && data.datasets.length > 1 && (
            <>
              <rect x="50" y="250" width="30" height="50" fill="rgba(220, 53, 69, 0.6)" />
              <rect x="90" y="230" width="30" height="70" fill="rgba(220, 53, 69, 0.6)" />
              <rect x="130" y="210" width="30" height="90" fill="rgba(220, 53, 69, 0.6)" />
              <rect x="170" y="190" width="30" height="110" fill="rgba(220, 53, 69, 0.6)" />
              <rect x="210" y="170" width="30" height="130" fill="rgba(220, 53, 69, 0.6)" />
            </>
          )}
        </svg>
      </ChartCanvas>
      
      {data.datasets && (
        <ChartLegend>
          {data.datasets.map((dataset, index) => (
            <LegendItem key={index}>
              <LegendColor color={dataset.backgroundColor ? 
                (Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[0] : dataset.backgroundColor) : 
                (index === 0 ? 'rgba(40, 167, 69, 0.6)' : 'rgba(220, 53, 69, 0.6)')} 
              />
              {dataset.label || `Dataset ${index + 1}`}
            </LegendItem>
          ))}
        </ChartLegend>
      )}
    </ChartContainer>
  );
};

export default BarChart; 