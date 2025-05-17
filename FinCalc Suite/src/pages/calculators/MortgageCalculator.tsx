import React, { useState, useEffect } from 'react';
import { Building, Calendar, Percent, PieChart, DollarSign, Save, Download } from 'lucide-react';
import Card from '../../components/ui/Card';
import Slider from '../../components/ui/Slider';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useCalculation } from '../../context/CalculationContext';
import PieChartComponent from '../../components/charts/PieChart';

const MortgageCalculator: React.FC = () => {
  const { addCalculation, currency } = useCalculation();
  
  const [homePrice, setHomePrice] = useState<number>(300000);
  const [downPayment, setDownPayment] = useState<number>(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [principalAmount, setPrincipalAmount] = useState<number>(0);

  // Update down payment amount when percent changes
  useEffect(() => {
    const newDownPayment = (homePrice * downPaymentPercent) / 100;
    setDownPayment(newDownPayment);
  }, [homePrice, downPaymentPercent]);

  // Update down payment percent when amount changes
  useEffect(() => {
    const newDownPaymentPercent = (downPayment / homePrice) * 100;
    setDownPaymentPercent(newDownPaymentPercent);
  }, [downPayment, homePrice]);

  // Calculate mortgage
  useEffect(() => {
    const principal = homePrice - downPayment;
    setPrincipalAmount(principal);
    
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    // Total number of payments
    const payments = loanTerm * 12;
    
    if (monthlyRate === 0) {
      // No interest
      const payment = principal / payments;
      setMonthlyPayment(payment);
      setTotalPayment(payment * payments);
      setTotalInterest(0);
    } else {
      // Calculate monthly payment using the formula:
      // M = P * (r(1+r)^n) / ((1+r)^n - 1)
      // Where M is the monthly payment, P is the principal, r is the monthly interest rate, and n is the number of payments
      const x = Math.pow(1 + monthlyRate, payments);
      const payment = (principal * monthlyRate * x) / (x - 1);
      
      setMonthlyPayment(payment);
      setTotalPayment(payment * payments);
      setTotalInterest((payment * payments) - principal);
    }
  }, [homePrice, downPayment, interestRate, loanTerm]);

  const handleSaveCalculation = () => {
    const inputs = {
      homePrice,
      downPayment,
      downPaymentPercent,
      loanTerm,
      interestRate
    };
    
    const results = {
      principalAmount,
      monthlyPayment,
      totalPayment,
      totalInterest
    };
    
    addCalculation('mortgage', inputs, results);
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
    { name: 'Principal', value: principalAmount, color: '#4f46e5' },
    { name: 'Interest', value: totalInterest, color: '#f59e0b' },
    { name: 'Down Payment', value: downPayment, color: '#10b981' }
  ];

  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mortgage Calculator</h1>
        <p className="text-gray-600 mt-2">
          Calculate your monthly mortgage payments and see a breakdown of costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Home Price
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(Number(e.target.value))}
                      leftIcon={<DollarSign size={16} className="text-gray-400" />}
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={50000}
                    max={1000000}
                    step={5000}
                    value={homePrice}
                    onChange={setHomePrice}
                    formatLabel={formatCurrency}
                    color="blue"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Down Payment
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      leftIcon={<DollarSign size={16} className="text-gray-400" />}
                      className="text-right"
                    />
                    <Input
                      type="number"
                      value={downPaymentPercent.toFixed(1)}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      rightIcon={<Percent size={16} className="text-gray-400" />}
                      className="text-right"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <Slider
                    min={0}
                    max={50}
                    step={0.5}
                    value={downPaymentPercent}
                    onChange={setDownPaymentPercent}
                    color="blue"
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
                      min="5"
                      max="30"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={5}
                    max={30}
                    step={5}
                    value={loanTerm}
                    onChange={setLoanTerm}
                    color="blue"
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
                      max="15"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={0.1}
                    value={interestRate}
                    onChange={setInterestRate}
                    color="blue"
                  />
                </div>
              </div>

              <div>
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Mortgage Summary</h3>
                  
                  <div className="mb-4">
                    <div className="text-sm text-blue-700 mb-1">Monthly Payment</div>
                    <div className="text-3xl font-bold text-blue-900">
                      {formatMonthlyPayment(monthlyPayment)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-blue-700 mb-1">Loan Amount</div>
                      <div className="text-xl font-semibold text-blue-900">
                        {formatCurrency(principalAmount)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-blue-700 mb-1">Total Interest</div>
                      <div className="text-xl font-semibold text-blue-900">
                        {formatCurrency(totalInterest)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <Button 
                    color="blue"
                    fullWidth
                    icon={<Save size={16} />}
                    onClick={handleSaveCalculation}
                    title="Save this calculation"
                  >
                    Save Calculation
                  </Button>
                  
                  <Button 
                    variant="outline"
                    color="blue"
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
            title="Cost Breakdown"
            icon={<PieChart size={20} className="text-blue-600" />}
          >
            <div className="py-4">
              <PieChartComponent data={pieChartData} />
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Mortgage Details</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Home Price:</span>
                  <span className="font-medium">{formatCurrency(homePrice)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Down Payment:</span>
                  <span className="font-medium">{formatCurrency(downPayment)} ({downPaymentPercent.toFixed(1)}%)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-medium">{formatCurrency(principalAmount)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-medium">{formatCurrency(totalInterest)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">{formatCurrency(principalAmount + totalInterest)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Loan Term:</span>
                  <span className="font-medium">{loanTerm} years ({loanTerm * 12} payments)</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;