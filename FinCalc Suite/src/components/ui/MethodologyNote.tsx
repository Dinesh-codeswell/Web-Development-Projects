import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface MethodologyNoteProps {
  title: string;
  description: string;
  lastUpdated?: string;
}

const MethodologyNote: React.FC<MethodologyNoteProps> = ({
  title,
  description,
  lastUpdated
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-6">
      <button
        className="w-full flex items-center justify-between text-left"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          <Info size={16} className="text-gray-600 mr-2" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-gray-600" />
        ) : (
          <ChevronDown size={16} className="text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 text-sm text-gray-600 space-y-2">
          <p>{description}</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MethodologyNote;