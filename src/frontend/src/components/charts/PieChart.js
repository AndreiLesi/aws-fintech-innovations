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
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
  gap: 15px;
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
 * A simple pie chart component
 * In a real application, this would use a charting library like Chart.js or Recharts
 */
const PieChart = ({ data }) => {
  if (!data || !data.labels || !data.datasets || data.labels.length === 0) {
    return (
      <ChartContainer>
        <ChartCanvas>
          <ChartMessage>No data available</ChartMessage>
        </ChartCanvas>
      </ChartContainer>
    );
  }

  // Get the colors from the dataset
  const colors = data.datasets[0].backgroundColor || [];

  return (
    <ChartContainer>
      <ChartCanvas>
        <ChartMessage>
          This is a placeholder for a pie chart. In a real application, this would render an actual chart using a library like Chart.js or Recharts.
        </ChartMessage>
        
        {/* Mock chart visualization */}
        <svg 
          width="200" 
          height="200" 
          viewBox="0 0 100 100"
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            opacity: 0.7
          }}
        >
          {/* Simple pie chart segments */}
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e9ecef" strokeWidth="20" />
          
          {/* First segment (25%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke={colors[0] || 'rgba(54, 162, 235, 0.6)'} 
            strokeWidth="20" 
            strokeDasharray="25 75" 
            strokeDashoffset="0" 
          />
          
          {/* Second segment (30%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke={colors[1] || 'rgba(255, 99, 132, 0.6)'} 
            strokeWidth="20" 
            strokeDasharray="30 70" 
            strokeDashoffset="-25" 
          />
          
          {/* Third segment (20%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke={colors[2] || 'rgba(255, 206, 86, 0.6)'} 
            strokeWidth="20" 
            strokeDasharray="20 80" 
            strokeDashoffset="-55" 
          />
          
          {/* Fourth segment (15%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke={colors[3] || 'rgba(75, 192, 192, 0.6)'} 
            strokeWidth="20" 
            strokeDasharray="15 85" 
            strokeDashoffset="-75" 
          />
          
          {/* Fifth segment (10%) */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke={colors[4] || 'rgba(153, 102, 255, 0.6)'} 
            strokeWidth="20" 
            strokeDasharray="10 90" 
            strokeDashoffset="-90" 
          />
        </svg>
      </ChartCanvas>
      
      <ChartLegend>
        {data.labels.map((label, index) => (
          <LegendItem key={index}>
            <LegendColor color={colors[index] || `hsl(${index * 50}, 70%, 60%)`} />
            {label}
          </LegendItem>
        ))}
      </ChartLegend>
    </ChartContainer>
  );
};

export default PieChart; 