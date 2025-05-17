import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import LoanCalculator from './pages/calculators/LoanCalculator';
import MortgageCalculator from './pages/calculators/MortgageCalculator';
import InvestmentCalculator from './pages/calculators/InvestmentCalculator';
import RetirementCalculator from './pages/calculators/RetirementCalculator';
import FinancialGlossary from './components/features/FinancialGlossary';
import FinancialQuiz from './components/features/FinancialQuiz';
import ScenarioSimulator from './components/features/ScenarioSimulator';
import { CalculationProvider } from './context/CalculationContext';

function App() {
  return (
    <CalculationProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Header />
          <div className="flex flex-grow">
            <Sidebar />
            <main className="flex-grow p-4 md:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/loan-calculator" element={<LoanCalculator />} />
                <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
                <Route path="/investment-calculator" element={<InvestmentCalculator />} />
                <Route path="/retirement-calculator" element={<RetirementCalculator />} />
                <Route path="/glossary" element={<FinancialGlossary />} />
                <Route path="/quiz" element={<FinancialQuiz />} />
                <Route path="/simulator" element={<ScenarioSimulator />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </CalculationProvider>
  );
}

export default App;