import React from 'react';
import { Calculator, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <Calculator size={24} className="text-indigo-400 mr-2" />
              <span className="font-bold text-xl">FinCalc Suite</span>
            </div>
            <p className="text-gray-400 text-sm">
              Powerful financial calculators for smart financial decisions. 
              Plan your future with confidence.
            </p>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Calculators</h3>
            <ul className="space-y-2">
              <li><a href="/loan-calculator" className="text-gray-400 hover:text-indigo-400 transition-colors">Loan Calculator</a></li>
              <li><a href="/mortgage-calculator" className="text-gray-400 hover:text-indigo-400 transition-colors">Mortgage Calculator</a></li>
              <li><a href="/investment-calculator" className="text-gray-400 hover:text-indigo-400 transition-colors">Investment Calculator</a></li>
              <li><a href="/retirement-calculator" className="text-gray-400 hover:text-indigo-400 transition-colors">Retirement Calculator</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Financial Glossary</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Investment Basics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Mortgage Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Saving Strategies</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} FinCalc Suite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;