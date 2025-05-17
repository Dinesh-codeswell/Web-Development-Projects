import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Building, 
  LineChart, 
  Landmark, 
  ArrowRight, 
  History 
} from 'lucide-react';
import { useCalculation } from '../context/CalculationContext';
import CalculationHistoryList from '../components/shared/CalculationHistoryList';

const Dashboard: React.FC = () => {
  const { calculationHistory } = useCalculation();
  
  // Sample financial tips
  const financialTips = [
    "Consider refinancing loans when interest rates drop significantly.",
    "The 50/30/20 rule suggests spending 50% on needs, 30% on wants, and 20% on savings.",
    "Start investing early to benefit from compound interest over time.",
    "Emergency funds should typically cover 3-6 months of expenses.",
    "Pay off high-interest debt before focusing on low-interest investments."
  ];

  return (
    <div className="container mx-auto px-4">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-indigo-800 to-blue-700 rounded-2xl p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Financial Calculator Suite
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            Make informed financial decisions with our comprehensive calculator tools. 
            Plan your future with confidence.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link 
              to="/loan-calculator" 
              className="bg-white text-indigo-800 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center"
            >
              Get Started <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link 
              to="/investment-calculator" 
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Explore Calculators
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link 
          to="/loan-calculator"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
        >
          <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
            <DollarSign size={24} className="text-indigo-700" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Loan Calculator</h2>
          <p className="text-gray-600 flex-grow">
            Calculate monthly payments, total interest, and amortization schedules for loans.
          </p>
          <div className="mt-4 text-indigo-700 font-medium flex items-center">
            Try it now <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link 
          to="/mortgage-calculator"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
        >
          <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
            <Building size={24} className="text-blue-700" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Mortgage Calculator</h2>
          <p className="text-gray-600 flex-grow">
            Estimate monthly mortgage payments, total interest, and compare different loan terms.
          </p>
          <div className="mt-4 text-blue-700 font-medium flex items-center">
            Try it now <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link 
          to="/investment-calculator"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
        >
          <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
            <LineChart size={24} className="text-green-700" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Investment Calculator</h2>
          <p className="text-gray-600 flex-grow">
            Project investment growth, returns, and analyze different investment strategies.
          </p>
          <div className="mt-4 text-green-700 font-medium flex items-center">
            Try it now <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        <Link 
          to="/retirement-calculator"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
        >
          <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4">
            <Landmark size={24} className="text-amber-700" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">Retirement Calculator</h2>
          <p className="text-gray-600 flex-grow">
            Plan for retirement by estimating savings needs, contributions, and withdraw rates.
          </p>
          <div className="mt-4 text-amber-700 font-medium flex items-center">
            Try it now <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <section className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <History size={24} className="mr-2 text-indigo-700" />
              Recent Calculations
            </h2>
            
            {calculationHistory.length > 0 ? (
              <CalculationHistoryList 
                history={calculationHistory.slice(0, 5)} 
                showViewAll
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  You haven't performed any calculations yet.
                </p>
                <Link 
                  to="/loan-calculator" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block"
                >
                  Try a Calculator
                </Link>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Financial Tips</h2>
            <ul className="space-y-4">
              {financialTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-800 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;