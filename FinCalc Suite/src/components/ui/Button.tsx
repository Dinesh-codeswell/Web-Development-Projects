import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  color?: 'indigo' | 'blue' | 'green' | 'amber' | 'red';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  color = 'indigo',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const colorClasses: Record<string, Record<string, string>> = {
    primary: {
      indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
      blue: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      green: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      amber: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
      red: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    },
    secondary: {
      indigo: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 focus:ring-indigo-400',
      blue: 'bg-blue-100 hover:bg-blue-200 text-blue-800 focus:ring-blue-400',
      green: 'bg-green-100 hover:bg-green-200 text-green-800 focus:ring-green-400',
      amber: 'bg-amber-100 hover:bg-amber-200 text-amber-800 focus:ring-amber-400',
      red: 'bg-red-100 hover:bg-red-200 text-red-800 focus:ring-red-400',
    },
    outline: {
      indigo: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
      blue: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      green: 'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
      amber: 'border border-amber-600 text-amber-600 hover:bg-amber-50 focus:ring-amber-500',
      red: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    },
    text: {
      indigo: 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 focus:ring-indigo-500',
      blue: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:ring-blue-500',
      green: 'text-green-600 hover:text-green-800 hover:bg-green-50 focus:ring-green-500',
      amber: 'text-amber-600 hover:text-amber-800 hover:bg-amber-50 focus:ring-amber-500',
      red: 'text-red-600 hover:text-red-800 hover:bg-red-50 focus:ring-red-500',
    },
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]} 
        ${colorClasses[variant][color]}
        ${disabled || isLoading ? disabledClasses : ''}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;