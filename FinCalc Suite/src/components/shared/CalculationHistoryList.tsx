import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Download, Calendar, Calculator } from 'lucide-react';
import { useCalculation } from '../../context/CalculationContext';

interface CalculationHistoryListProps {
  history: Array<{
    id: string;
    type: string;
    date: Date;
    inputs: Record<string, any>;
    results: Record<string, any>;
  }>;
  showViewAll?: boolean;
}

const CalculationHistoryList: React.FC<CalculationHistoryListProps> = ({ 
  history,
  showViewAll = false
}) => {
  const { currency } = useCalculation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCalculatorRoute = (type: string) => {
    const typeToRoute: Record<string, string> = {
      'loan': '/loan-calculator',
      'mortgage': '/mortgage-calculator',
      'investment': '/investment-calculator',
      'retirement': '/retirement-calculator',
    };
    
    return typeToRoute[type] || '/';
  };

  const getCalculationSummary = (type: string, inputs: Record<string, any>, results: Record<string, any>) => {
    if (type === 'loan' || type === 'mortgage') {
      return {
        primary: formatCurrency(inputs.loanAmount || inputs.homePrice || 0),
        secondary: `${inputs.interestRate}% for ${inputs.loanTerm} years`,
        result: `${formatCurrency(results.monthlyPayment || 0)}/month`
      };
    } else if (type === 'investment') {
      return {
        primary: formatCurrency(inputs.initialInvestment || 0),
        secondary: `${inputs.yearsToGrow} years at ${inputs.interestRate}%`,
        result: formatCurrency(results.finalAmount || 0)
      };
    } else if (type === 'retirement') {
      return {
        primary: `Age ${inputs.currentAge || 0} to ${inputs.retirementAge || 0}`,
        secondary: `${formatCurrency(inputs.monthlyContribution || 0)}/month`,
        result: formatCurrency(results.retirementSavings || 0)
      };
    }
    
    return {
      primary: 'Calculation',
      secondary: 'Details',
      result: 'Result'
    };
  };

  const handleExport = (item: any) => {
    const dataStr = JSON.stringify({
      type: item.type,
      date: item.date,
      inputs: item.inputs,
      results: item.results
    }, null, 2);
    
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${item.type}-calculation-${new Date().getTime()}.json`);
    linkElement.click();
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No calculation history available.</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-gray-100">
        {history.map((item) => {
          const summary = getCalculationSummary(item.type, item.inputs, item.results);
          
          return (
            <li key={item.id} className="py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center">
                    <Calculator size={16} className="text-indigo-600 mr-2" />
                    <h3 className="font-medium text-gray-900 capitalize">
                      {item.type} Calculator
                    </h3>
                  </div>
                  
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(item.date)}</span>
                    <Clock size={14} className="ml-3 mr-1" />
                    <span>
                      {new Date(item.date).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleExport(item)}
                  className="text-gray-400 hover:text-indigo-600 p-1 transition-colors"
                  title="Export calculation"
                >
                  <Download size={18} />
                </button>
              </div>
              
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-medium">{summary.primary}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Terms</p>
                  <p className="font-medium">{summary.secondary}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Result</p>
                  <p className="font-medium text-indigo-600">{summary.result}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <Link 
                  to={getCalculatorRoute(item.type)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Recalculate
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      
      {showViewAll && history.length > 0 && (
        <div className="mt-4 text-center">
          <Link 
            to="/history"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-sm"
          >
            View all calculations
          </Link>
        </div>
      )}
    </div>
  );
};

export default CalculationHistoryList;