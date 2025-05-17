import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface SecurityBadgeProps {
  type: 'encryption' | 'verified' | 'secure';
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({ type }) => {
  const badges = {
    encryption: {
      icon: <Lock size={14} className="text-green-600" />,
      text: '256-bit Encryption',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    verified: {
      icon: <Shield size={14} className="text-blue-600" />,
      text: 'Verified Calculations',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    secure: {
      icon: <Shield size={14} className="text-indigo-600" />,
      text: 'Secure Connection',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  };

  const badge = badges[type];

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full border ${badge.color} text-xs font-medium`}>
      {badge.icon}
      <span className="ml-1">{badge.text}</span>
    </div>
  );
};

export default SecurityBadge;