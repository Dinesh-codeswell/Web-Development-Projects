import React, { useState, useEffect } from 'react';
import { Landmark, Calendar, DollarSign, Percent, Save, Download, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Slider from '../../components/ui/Slider';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useCalculation } from '../../context/CalculationContext';
import AreaChartComponent from '../../components/charts/AreaChart';

const RetirementCalculator: React.FC = () => {
  const { addCalculation, currency } = useCalculation();
  
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [retirementLength, setRetirementLength] = useState<number>(25);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4);
  
  const [retirementSavings, setRetirementSavings] = useState<number>(0);
  const [monthlyRetirementIncome, setMonthlyRetirementIncome] = useState<number>(0);
  const [projectionData, setProjectionData] = useState<any[]>([]);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    
    if (yearsToRetirement <= 0) {
      return;
    }
    
    // Monthly return rate
    const monthlyReturnRate = expectedReturn / 100 / 12;
    
    // Calculate future value of current savings
    let futureValueOfCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
    
    // Calculate future value of monthly contributions
    // Formula: FV = PMT × ((1 + r)^n - 1) / r
    // Where FV is future value, PMT is monthly payment, r is monthly interest rate, n is number of months
    const months = yearsToRetirement * 12;
    let futureValueOfContributions = 0;
    
    if (monthlyReturnRate > 0) {
      futureValueOfContributions = monthlyContribution * ((Math.pow(1 + monthlyReturnRate, months) - 1) / monthlyReturnRate);
    } else {
      futureValueOfContributions = monthlyContribution * months;
    }
    
    // Total retirement savings
    const totalRetirementSavings = futureValueOfCurrentSavings + futureValueOfContributions;
    
    // Calculate sustainable monthly income in retirement
    // Based on the withdrawal rate
    const annualWithdrawal = totalRetirementSavings * (withdrawalRate / 100);
    const monthlyIncome = annualWithdrawal / 12;
    
    setRetirementSavings(totalRetirementSavings);
    setMonthlyRetirementIncome(monthlyIncome);
    
    // Generate projection data
    generateProjectionData(yearsToRetirement);
  };

  const generateProjectionData = (yearsToRetirement: number) => {
    const data = [];
    let currentBalance = currentSavings;
    const annualContribution = monthlyContribution * 12;
    
    // Generate data for accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAge + year;
      
      data.push({
        age,
        balance: currentBalance,
        phase: 'accumulation'
      });
      
      // Apply growth rate and add contribution for next year
      currentBalance = currentBalance * (1 + expectedReturn / 100) + annualContribution;
    }
    
    // Generate data for distribution phase
    const withdrawalAmount = retirementSavings * (withdrawalRate / 100);
    let retirementBalance = retirementSavings;
    
    for (let year = 1; year <= retirementLength; year++) {
      const age = retirementAge + year;
      
      // Adjust withdrawal for inflation
      const adjustedWithdrawal = withdrawalAmount * Math.pow(1 + inflationRate / 100, year);
      
      // Calculate new balance (remaining grows at expected return)
      retirementBalance = (retirementBalance - adjustedWithdrawal) * (1 + expectedReturn / 100);
      
      // Break if balance gets too low/negative
      if (retirementBalance <= 0) {
        retirementBalance = 0;
        data.push({
          age,
          balance: retirementBalance,
          phase: 'distribution'
        });
        break;
      }
      
      data.push({
        age,
        balance: retirementBalance,
        phase: 'distribution'
      });
    }
    
    setProjectionData(data);
  };

  useEffect(() => {
    calculateRetirement();
  }, [
    currentAge, 
    retirementAge, 
    currentSavings, 
    monthlyContribution, 
    expectedReturn, 
    retirementLength, 
    inflationRate, 
    withdrawalRate
  ]);

  const handleSaveCalculation = () => {
    const inputs = {
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      retirementLength,
      inflationRate,
      withdrawalRate
    };
    
    const results = {
      retirementSavings,
      monthlyRetirementIncome,
      yearsToRetirement: retirementAge - currentAge
    };
    
    addCalculation('retirement', inputs, results);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMonthlyIncome = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Retirement Calculator</h1>
        <p className="text-gray-600 mt-2">
          Plan your retirement by estimating your future savings and income needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Age
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Number(e.target.value))}
                      leftIcon={<Calendar size={16} className="text-gray-400" />}
                      className="text-right"
                      min="18"
                      max="80"
                    />
                  </div>
                  <Slider
                    min={18}
                    max={80}
                    step={1}
                    value={currentAge}
                    onChange={setCurrentAge}
                    color="amber"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retirement Age
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Number(e.target.value))}
                      leftIcon={<Calendar size={16} className="text-gray-400" />}
                      className="text-right"
                      min={currentAge + 1}
                      max="90"
                    />
                  </div>
                  <Slider
                    min={Math.max(currentAge + 1, 50)}
                    max={80}
                    step={1}
                    value={retirementAge}
                    onChange={setRetirementAge}
                    color="amber"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Savings
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
                      leftIcon={<DollarSign size={16} className="text-gray-400" />}
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={0}
                    max={500000}
                    step={10000}
                    value={currentSavings}
                    onChange={setCurrentSavings}
                    formatLabel={formatCurrency}
                    color="amber"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Contribution
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      leftIcon={<DollarSign size={16} className="text-gray-400" />}
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={0}
                    max={3000}
                    step={100}
                    value={monthlyContribution}
                    onChange={setMonthlyContribution}
                    formatLabel={formatCurrency}
                    color="amber"
                  />
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Annual Return (%)
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      leftIcon={<Percent size={16} className="text-gray-400" />}
                      step="0.1"
                      min="0"
                      max="15"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={1}
                    max={12}
                    step={0.1}
                    value={expectedReturn}
                    onChange={setExpectedReturn}
                    color="amber"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Retirement Length (years)
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={retirementLength}
                      onChange={(e) => setRetirementLength(Number(e.target.value))}
                      leftIcon={<Calendar size={16} className="text-gray-400" />}
                      min="1"
                      max="50"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={10}
                    max={40}
                    step={1}
                    value={retirementLength}
                    onChange={setRetirementLength}
                    color="amber"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inflation Rate (%)
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      leftIcon={<Percent size={16} className="text-gray-400" />}
                      step="0.1"
                      min="0"
                      max="10"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={0}
                    max={8}
                    step={0.1}
                    value={inflationRate}
                    onChange={setInflationRate}
                    color="amber"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Withdrawal Rate (%)
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={withdrawalRate}
                      onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                      leftIcon={<Percent size={16} className="text-gray-400" />}
                      step="0.1"
                      min="1"
                      max="10"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={2}
                    max={8}
                    step={0.1}
                    value={withdrawalRate}
                    onChange={setWithdrawalRate}
                    color="amber"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-amber-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">Retirement Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-amber-700 mb-1">Projected Savings at Retirement</div>
                    <div className="text-2xl font-bold text-amber-900">
                      {formatCurrency(retirementSavings)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-amber-700 mb-1">Monthly Retirement Income</div>
                    <div className="text-2xl font-bold text-amber-900">
                      {formatMonthlyIncome(monthlyRetirementIncome)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-amber-700 mb-1">Years to Retirement</div>
                    <div className="text-2xl font-bold text-amber-900">
                      {retirementAge - currentAge}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <Button 
                  color="amber"
                  icon={<Save size={16} />}
                  onClick={handleSaveCalculation}
                  title="Save this calculation"
                >
                  Save Calculation
                </Button>
                
                <Button 
                  variant="outline"
                  color="amber"
                  icon={<Download size={16} />}
                  title="Download retirement projection"
                >
                  Download Projection
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card
            title="Retirement Projection"
            icon={<Landmark size={20} className="text-amber-600" />}
          >
            <div className="py-4">
              <AreaChartComponent data={projectionData} currency={currency} />
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Retirement Insights</h4>
              
              <div className="grid grid-cols-1 gap-4 mt-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Starting at age {currentAge} with {formatCurrency(currentSavings)}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Contributing {formatCurrency(monthlyContribution)} monthly</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-700 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Retiring at age {retirementAge}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-900 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Withdrawing {withdrawalRate}% annually</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Investment Growth Rate:</span>
                  <span className="text-amber-600 font-medium flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    {expectedReturn}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Inflation Rate:</span>
                  <span className="text-amber-600 font-medium">
                    {inflationRate}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;