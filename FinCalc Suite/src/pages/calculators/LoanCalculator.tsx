import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Percent, PieChart, Download, Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Slider from '../../components/ui/Slider';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useCalculation } from '../../context/CalculationContext';
import PieChartComponent from '../../components/charts/PieChart';

const LoanCalculator: React.FC = () => {
  const { addCalculation, currency } = useCalculation();
  
  const [loanAmount, setLoanAmount] = useState<number>(20000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [loanTerm, setLoanTerm] = useState<number>(5);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  const calculateLoan = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    // Total number of payments
    const payments = loanTerm * 12;
    
    // Calculate monthly payment
    // Formula: P = L[i(1+i)^n]/[(1+i)^n-1]
    // Where: P = payment, L = loan amount, i = interest rate (monthly), n = number of payments
    
    if (monthlyRate === 0) {
      // No interest
      const payment = loanAmount / payments;
      setMonthlyPayment(payment);
      setTotalPayment(payment * payments);
      setTotalInterest(0);
    } else {
      const x = Math.pow(1 + monthlyRate, payments);
      const payment = (loanAmount * monthlyRate * x) / (x - 1);
      
      setMonthlyPayment(payment);
      setTotalPayment(payment * payments);
      setTotalInterest((payment * payments) - loanAmount);
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  const handleSaveCalculation = () => {
    const inputs = {
      loanAmount,
      interestRate,
      loanTerm
    };
    
    const results = {
      monthlyPayment,
      totalPayment,
      totalInterest
    };
    
    addCalculation('loan', inputs, results);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonthlyPayment = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const pieChartData = [
    { name: 'Principal', value: loanAmount, color: '#4f46e5' },
    { name: 'Interest', value: totalInterest, color: '#f59e0b' }
  ];

  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Loan Calculator</h1>
        <p className="text-gray-600 mt-2">
          Calculate your monthly loan payments and view a breakdown of interest vs. principal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      leftIcon={<DollarSign size={16} className="text-gray-400" />}
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={1000}
                    max={100000}
                    step={1000}
                    value={loanAmount}
                    onChange={setLoanAmount}
                    formatLabel={formatCurrency}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (%)
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      leftIcon={<Percent size={16} className="text-gray-400" />}
                      step="0.1"
                      min="0"
                      max="30"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={0}
                    max={20}
                    step={0.1}
                    value={interestRate}
                    onChange={setInterestRate}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Term (years)
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      leftIcon={<Calendar size={16} className="text-gray-400" />}
                      min="1"
                      max="30"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={1}
                    max={30}
                    step={1}
                    value={loanTerm}
                    onChange={setLoanTerm}
                  />
                </div>
              </div>

              <div>
                <div className="bg-indigo-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4">Loan Summary</h3>
                  
                  <div className="mb-4">
                    <div className="text-sm text-indigo-700 mb-1">Monthly Payment</div>
                    <div className="text-3xl font-bold text-indigo-900">
                      {formatMonthlyPayment(monthlyPayment)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-indigo-700 mb-1">Total Payment</div>
                      <div className="text-xl font-semibold text-indigo-900">
                        {formatCurrency(totalPayment)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-indigo-700 mb-1">Total Interest</div>
                      <div className="text-xl font-semibold text-indigo-900">
                        {formatCurrency(totalInterest)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <Button 
                    color="indigo"
                    fullWidth
                    icon={<Save size={16} />}
                    onClick={handleSaveCalculation}
                    title="Save this calculation"
                  >
                    Save Calculation
                  </Button>
                  
                  <Button 
                    variant="outline"
                    color="indigo"
                    fullWidth
                    icon={<Download size={16} />}
                    title="Download amortization schedule"
                  >
                    Download Schedule
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card
            title="Payment Breakdown"
            icon={<PieChart size={20} className="text-indigo-600" />}
          >
            <div className="py-4">
              <PieChartComponent data={pieChartData} />
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Loan Details</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Principal Amount:</span>
                  <span className="font-medium">{formatCurrency(loanAmount)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-medium">{formatCurrency(totalInterest)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">{formatCurrency(totalPayment)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-medium">{formatMonthlyPayment(monthlyPayment)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Number of Payments:</span>
                  <span className="font-medium">{loanTerm * 12}</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;