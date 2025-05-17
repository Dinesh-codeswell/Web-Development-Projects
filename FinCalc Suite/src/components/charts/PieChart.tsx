import React from 'react';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  size?: number;
}

const PieChartComponent: React.FC<PieChartProps> = ({ 
  data,
  size = 200
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;

  // Calculate percentage and angle for each segment
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    
    const segment = {
      ...item,
      percentage,
      startAngle,
      endAngle: startAngle + angle
    };
    
    startAngle += angle;
    return segment;
  });

  // Function to create SVG arc path
  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const centerX = radius;
    const centerY = radius;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const radius = size / 2;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={createArc(segment.startAngle, segment.endAngle, radius)}
              fill={segment.color}
              stroke="white"
              strokeWidth="1"
              className="transition-all duration-300 hover:opacity-90"
            />
          ))}
        </svg>
      </div>
      
      <div className="mt-6 w-full">
        <ul className="space-y-2">
          {segments.map((segment, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm text-gray-700">{segment.name}</span>
              </div>
              <div className="text-sm font-medium">
                {segment.percentage.toFixed(1)}%
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChartComponent;