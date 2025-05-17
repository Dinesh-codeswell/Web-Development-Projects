import React from 'react';
import { ArrowRightLeft as ArrowsRightLeft } from 'lucide-react';
import Card from './Card';

interface ComparisonViewProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftLabel: string;
  rightLabel: string;
  onSwap?: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  leftContent,
  rightContent,
  leftLabel,
  rightLabel,
  onSwap
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
      <Card className="h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{leftLabel}</h3>
          {onSwap && (
            <button
              onClick={onSwap}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Swap scenarios"
            >
              <ArrowsRightLeft size={20} className="text-gray-600" />
            </button>
          )}
        </div>
        {leftContent}
      </Card>

      <Card className="h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{rightLabel}</h3>
        </div>
        {rightContent}
      </Card>

      <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <ArrowsRightLeft size={20} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;