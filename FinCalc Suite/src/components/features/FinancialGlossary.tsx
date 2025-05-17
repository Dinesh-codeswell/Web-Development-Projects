import React, { useState, useEffect } from 'react';
import { Search, Book } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';

interface Term {
  term: string;
  definition: string;
  category: string;
}

const financialTerms: Term[] = [
  {
    term: "APR",
    definition: "Annual Percentage Rate - The yearly interest rate charged for borrowing, including fees.",
    category: "Loans"
  },
  {
    term: "Compound Interest",
    definition: "Interest calculated on both the initial principal and accumulated interest from previous periods.",
    category: "Investments"
  },
  {
    term: "Amortization",
    definition: "The process of spreading out a loan into a series of fixed payments over time.",
    category: "Loans"
  },
  // Add more terms as needed
];

const FinancialGlossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTerms, setFilteredTerms] = useState(financialTerms);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(financialTerms.map(term => term.category))];

  useEffect(() => {
    const filtered = financialTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredTerms(filtered);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial Glossary</h1>
        <p className="text-gray-600 mt-2">
          Explore and understand common financial terms and concepts.
        </p>
      </div>

      <Card>
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search financial terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={16} className="text-gray-400" />}
                fullWidth
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                    <Book size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{term.term}</h3>
                    <p className="text-gray-600">{term.definition}</p>
                    <span className="inline-block mt-2 text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {term.category}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No terms found matching your search criteria.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FinancialGlossary;