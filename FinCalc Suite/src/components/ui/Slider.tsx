import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  color?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel,
  color = 'indigo'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const getPercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const colorClasses: Record<string, string> = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600'
  };

  const thumbColorClasses: Record<string, string> = {
    indigo: 'border-indigo-600',
    blue: 'border-blue-600', 
    green: 'border-green-600',
    amber: 'border-amber-600',
    red: 'border-red-600'
  };

  const activeThumbColorClasses: Record<string, string> = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600'
  };

  const trackColor = colorClasses[color] || colorClasses.indigo;
  const thumbBorderColor = thumbColorClasses[color] || thumbColorClasses.indigo;
  const thumbActiveColor = activeThumbColorClasses[color] || activeThumbColorClasses.indigo;

  return (
    <div className="w-full py-4">
      <div className="relative">
        <div
          ref={sliderRef}
          className="h-2 bg-gray-200 rounded-full overflow-hidden"
        >
          <div
            className={`h-full ${trackColor} transition-all duration-300 ease-out`}
            style={{ width: `${getPercentage()}%` }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
        />
        
        <div
          className={`absolute h-5 w-5 rounded-full border-2 ${thumbBorderColor} bg-white transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150 ${
            isDragging ? `${thumbActiveColor} border-transparent scale-110` : 'bg-white'
          }`}
          style={{
            top: '50%',
            left: `${getPercentage()}%`,
          }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{formatLabel ? formatLabel(min) : min}</span>
        <span>{formatLabel ? formatLabel(max) : max}</span>
      </div>
    </div>
  );
};

export default Slider;