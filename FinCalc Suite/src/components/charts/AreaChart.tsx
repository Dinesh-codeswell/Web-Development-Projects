import React from 'react';

interface AreaChartProps {
  data: Array<{
    age: number;
    balance: number;
    phase: string;
  }>;
  currency: string;
}

const AreaChartComponent: React.FC<AreaChartProps> = ({ data, currency }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No data available</div>;
  }
  
  // Find the maximum value to scale the chart properly
  const maxValue = Math.max(...data.map(item => item.balance));
  const minValue = 0; // Always start at 0 for financial charts
  
  // Chart dimensions
  const width = 300;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  
  // Calculate the inner chart area
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  
  // Scale data points to fit within the chart
  const scaleX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * innerWidth;
  };
  
  const scaleY = (value: number) => {
    return height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * innerHeight;
  };
  
  // Find retirement index (where phase changes from accumulation to distribution)
  const retirementIndex = data.findIndex(item => item.phase === 'distribution');
  
  // Split data into pre-retirement and post-retirement
  const preRetirementData = retirementIndex > 0 
    ? data.slice(0, retirementIndex) 
    : data;
  
  const postRetirementData = retirementIndex > 0 
    ? data.slice(retirementIndex - 1) // Overlap by 1 to connect lines
    : [];
  
  // Create the accumulation phase line path
  const accumulationPath = preRetirementData.map((item, index) => {
    const x = scaleX(index);
    const y = scaleY(item.balance);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Create the distribution phase line path
  const distributionPath = postRetirementData.length > 0 
    ? postRetirementData.map((item, index) => {
        const x = scaleX(retirementIndex - 1 + index);
        const y = scaleY(item.balance);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ')
    : '';
  
  // Create the area paths
  const accumulationAreaPath = preRetirementData.length > 0 
    ? [
        ...preRetirementData.map((item, index) => {
          const x = scaleX(index);
          const y = scaleY(item.balance);
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }),
        `L ${scaleX(preRetirementData.length - 1)} ${height - padding.bottom}`,
        `L ${scaleX(0)} ${height - padding.bottom}`,
        'Z'
      ].join(' ')
    : '';
  
  const distributionAreaPath = postRetirementData.length > 0 
    ? [
        ...postRetirementData.map((item, index) => {
          const x = scaleX(retirementIndex - 1 + index);
          const y = scaleY(item.balance);
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }),
        `L ${scaleX(data.length - 1)} ${height - padding.bottom}`,
        `L ${scaleX(retirementIndex - 1)} ${height - padding.bottom}`,
        'Z'
      ].join(' ')
    : '';
  
  // Generate x-axis ticks (ages)
  const xTicks = data.filter((_, index) => {
    // Show fewer ticks if there's a lot of data
    const interval = data.length > 20 ? 5 : 4;
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
        {/* Area under the accumulation line */}
        {accumulationAreaPath && (
          <path
            d={accumulationAreaPath}
            fill="url(#amberGradient)"
            opacity="0.2"
          />
        )}
        
        {/* Area under the distribution line */}
        {distributionAreaPath && (
          <path
            d={distributionAreaPath}
            fill="url(#redGradient)"
            opacity="0.2"
          />
        )}
        
        {/* Accumulation phase line */}
        {accumulationPath && (
          <path
            d={accumulationPath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
        )}
        
        {/* Distribution phase line */}
        {distributionPath && (
          <path
            d={distributionPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
        )}
        
        {/* Data points */}
        {data.filter((_, index) => {
          // Show fewer points if there's a lot of data
          const interval = data.length > 20 ? 5 : 4;
          return index === 0 || index === data.length - 1 || 
                 index === retirementIndex - 1 || index === retirementIndex ||
                 index % interval === 0;
        }).map((item, index) => {
          const dataIndex = data.findIndex(d => d.age === item.age);
          const isRetirementPoint = item.phase === 'distribution' && 
                                    dataIndex > 0 && 
                                    data[dataIndex - 1].phase === 'accumulation';
          
          return (
            <circle
              key={index}
              cx={scaleX(dataIndex)}
              cy={scaleY(item.balance)}
              r={isRetirementPoint ? "4" : "3"}
              fill="white"
              stroke={item.phase === 'accumulation' ? "#f59e0b" : "#ef4444"}
              strokeWidth={isRetirementPoint ? "3" : "2"}
              className="transition-all duration-300 hover:r-4"
            />
          );
        })}
        
        {/* Retirement point indicator (vertical line) */}
        {retirementIndex > 0 && (
          <line
            x1={scaleX(retirementIndex - 1)}
            y1={padding.top}
            x2={scaleX(retirementIndex - 1)}
            y2={height - padding.bottom}
            stroke="#6b7280"
            strokeWidth="1"
            strokeDasharray="4,2"
          />
        )}
        
        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        
        {/* X-axis ticks (ages) */}
        {xTicks.map((tick, index) => {
          const dataIndex = data.findIndex(d => d.age === tick.age);
          return (
            <g key={index}>
              <line
                x1={scaleX(dataIndex)}
                y1={height - padding.bottom}
                x2={scaleX(dataIndex)}
                y2={height - padding.bottom + 5}
                stroke="#9ca3af"
                strokeWidth="1"
              />
              <text
                x={scaleX(dataIndex)}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {tick.age}
              </text>
            </g>
          );
        })}
        
        {/* Y-axis ticks (values) */}
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
        
        {/* Gradients for area fills */}
        <defs>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center mt-2 text-xs">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
          <span className="text-gray-600">Accumulation</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span className="text-gray-600">Distribution</span>
        </div>
      </div>
    </div>
  );
};

export default AreaChartComponent;