import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

interface InfoTooltipProps {
  id: string;
  content: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ id, content }) => {
  return (
    <>
      <HelpCircle
        size={16}
        className="text-gray-400 hover:text-gray-600 cursor-help ml-1"
        data-tooltip-id={id}
        aria-label={`Information about ${id}`}
      />
      <Tooltip
        id={id}
        content={content}
        place="top"
        className="max-w-xs bg-gray-900 text-white text-sm py-2 px-3 rounded shadow-lg z-50"
      />
    </>
  );
};

export default InfoTooltip;