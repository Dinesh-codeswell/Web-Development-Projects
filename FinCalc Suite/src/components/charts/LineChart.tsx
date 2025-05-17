import React from 'react';

interface LineChartProps {
  data: Array<{
    year: number;
    value: number;
    contributions?: number;
    interest?: number;
  }>;
  currency: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({ data, currency }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }
  
  // Find the maximum value to scale the chart properly
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = 0; // Always start at 0 for financial charts
  
  // Chart dimensions
  const width = 300;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  
  // Calculate the inner chart area
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  // Scale data points to fit within the chart
  const scaleX = (year: number, index: number) => {
    return padding.left + (index / (data.length - 1)) * innerWidth;
  };
  
  const scaleY = (value: number) => {
    return height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * innerHeight;
  };
  
  // Create the line path
  const linePath = data.map((item, index) => {
    const x = scaleX(item.year, index);
    const y = scaleY(item.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Create the area path (fills the area under the line)
  const areaPath = [
    ...data.map((item, index) => {
      const x = scaleX(item.year, index);
      const y = scaleY(item.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }),
    `L ${scaleX(data[data.length - 1].year, data.length - 1)} ${height - padding.bottom}`,
    `L ${scaleX(data[0].year, 0)} ${height - padding.bottom}`,
    'Z'
  ].join(' ');
  
  // Generate x-axis ticks (years)
  const xTicks = data.filter((_, index) => {
    // Show fewer ticks if there's a lot of data
    const interval = data.length > 20 ? 5 : 2;
    return index === 0 || index === data.length - 1 || index % interval === 0;
  });
  
  // Generate y-axis ticks (values)
  const numYTicks = 5;
  const yTicks = Array.from({ length: numYTicks }, (_, i) => {
    return minValue + ((maxValue - minValue) / (numYTicks - 1)) * i;
  });
  
  // Format currency values
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* Area under the line */}
        <path
          d={areaPath}
          fill="url(#greenGradient)"
          opacity="0.2"
        />
        
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {data.filter((_, index) => {
          // Show fewer points if there's a lot of data
          const interval = data.length > 20 ? 5 : 2;
          return index === 0 || index === data.length - 1 || index % interval === 0;
        }).map((item, index) => (
          <circle
            key={index}
            cx={scaleX(item.year, data.findIndex(d => d.year === item.year))}
            cy={scaleY(item.value)}
            r="3"
            fill="white"
            stroke="#10b981"
            strokeWidth="2"
            className="transition-all duration-300 hover:r-4"
          />
        ))}
        
        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        
        {/* X-axis ticks */}
        {xTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={scaleX(tick.year, data.findIndex(d => d.year === tick.year))}
              y1={height - padding.bottom}
              x2={scaleX(tick.year, data.findIndex(d => d.year === tick.year))}
              y2={height - padding.bottom + 5}
              stroke="#9ca3af"
              strokeWidth="1"
            />
            <text
              x={scaleX(tick.year, data.findIndex(d => d.year === tick.year))}
              y={height - padding.bottom + 15}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {tick.year}
            </text>
          </g>
        ))}
        
        {/* Y-axis ticks */}
        {yTicks.map((tick, index) => (
          <g key={index}>
            <line
              x1={padding.left}
              y1={scaleY(tick)}
              x2={width - padding.right}
              y2={scaleY(tick)}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray={index === 0 ? "0" : "2,2"}
            />
            <text
              x={padding.left - 5}
              y={scaleY(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {formatCurrency(tick)}
            </text>
          </g>
        ))}
        
        {/* Gradient for area fill */}
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LineChartComponent;