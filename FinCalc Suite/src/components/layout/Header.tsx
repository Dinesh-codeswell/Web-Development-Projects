import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Menu, X } from 'lucide-react';
import { useCalculation } from '../../context/CalculationContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currency, setCurrency } = useCalculation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' },
    { code: 'CAD', symbol: 'C$' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-indigo-900 to-blue-800 py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <Calculator 
              size={28} 
              className={`${isScrolled ? 'text-indigo-700' : 'text-white'}`} 
            />
            <span 
              className={`font-bold text-xl md:text-2xl transition-colors ${
                isScrolled ? 'text-indigo-900' : 'text-white'
              }`}
            >
              FinCalc Suite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`bg-transparent border ${
                isScrolled ? 'text-gray-800 border-gray-300' : 'text-white border-blue-300'
              } rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
            
            <Link 
              to="/" 
              className={`transition-colors ${
                isScrolled ? 'text-gray-800 hover:text-indigo-700' : 'text-white hover:text-indigo-200'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/loan-calculator" 
              className={`transition-colors ${
                isScrolled ? 'text-gray-800 hover:text-indigo-700' : 'text-white hover:text-indigo-200'
              }`}
            >
              Loans
            </Link>
            <Link 
              to="/investment-calculator" 
              className={`transition-colors ${
                isScrolled ? 'text-gray-800 hover:text-indigo-700' : 'text-white hover:text-indigo-200'
              }`}
            >
              Investments
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
            ) : (
              <Menu size={24} className={isScrolled ? 'text-gray-800' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col space-y-4">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`bg-transparent border ${
                isScrolled ? 'text-gray-800 border-gray-300' : 'text-white border-blue-300'
              } rounded px-2 py-1 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
            
            <Link 
              to="/" 
              className={isScrolled ? 'text-gray-800' : 'text-white'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/loan-calculator" 
              className={isScrolled ? 'text-gray-800' : 'text-white'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Loan Calculator
            </Link>
            <Link 
              to="/mortgage-calculator" 
              className={isScrolled ? 'text-gray-800' : 'text-white'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mortgage Calculator
            </Link>
            <Link 
              to="/investment-calculator" 
              className={isScrolled ? 'text-gray-800' : 'text-white'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Investment Calculator
            </Link>
            <Link 
              to="/retirement-calculator" 
              className={isScrolled ? 'text-gray-800' : 'text-white'}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Retirement Calculator
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;