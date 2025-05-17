import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Percent, LineChart, TrendingUp, Save, Download } from 'lucide-react';
import Card from '../../components/ui/Card';
import Slider from '../../components/ui/Slider';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useCalculation } from '../../context/CalculationContext';
import LineChartComponent from '../../components/charts/LineChart';

const InvestmentCalculator: React.FC = () => {
  const { addCalculation, currency } = useCalculation();
  
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [yearsToGrow, setYearsToGrow] = useState<number>(20);
  const [compoundingFrequency, setCompoundingFrequency] = useState<string>("annually");
  
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalInterestEarned, setTotalInterestEarned] = useState<number>(0);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const calculateInvestment = () => {
    // Get number of compounds per year
    const compoundsPerYear = 
      compoundingFrequency === "annually" ? 1 :
      compoundingFrequency === "semi-annually" ? 2 :
      compoundingFrequency === "quarterly" ? 4 :
      compoundingFrequency === "monthly" ? 12 :
      compoundingFrequency === "daily" ? 365 : 1;
    
    // Calculate rate per period
    const ratePerPeriod = interestRate / 100 / compoundsPerYear;
    
    // Total periods
    const totalPeriods = yearsToGrow * compoundsPerYear;
    
    // Monthly contribution as per-period contribution
    const contributionPerPeriod = 
      monthlyContribution * (compoundsPerYear === 1 ? 12 :
      compoundsPerYear === 2 ? 6 :
      compoundsPerYear === 4 ? 3 :
      compoundsPerYear === 12 ? 1 : 
      12/365);
    
    let currentAmount = initialInvestment;
    let totalContribution = initialInvestment;
    
    // Create data for chart
    const newYearlyData: any[] = [];
    
    for (let period = 1; period <= totalPeriods; period++) {
      // Add contribution
      currentAmount += contributionPerPeriod;
      totalContribution += contributionPerPeriod;
      
      // Apply interest
      currentAmount *= (1 + ratePerPeriod);
      
      // Store yearly data for chart
      if (period % compoundsPerYear === 0 || period === totalPeriods) {
        const year = Math.ceil(period / compoundsPerYear);
        newYearlyData.push({
          year: year,
          value: currentAmount,
          contributions: totalContribution,
          interest: currentAmount - totalContribution
        });
      }
    }
    
    setFinalAmount(currentAmount);
    setTotalContributions(totalContribution);
    setTotalInterestEarned(currentAmount - totalContribution);
    setYearlyData(newYearlyData);
  };

  useEffect(() => {
    calculateInvestment();
  }, [initialInvestment, monthlyContribution, interestRate, yearsToGrow, compoundingFrequency]);

  const handleSaveCalculation = () => {
    const inputs = {
      initialInvestment,
      monthlyContribution,
      interestRate,
      yearsToGrow,
      compoundingFrequency
    };
    
    const results = {
      finalAmount,
      totalContributions,
      totalInterestEarned
    };
    
    addCalculation('investment', inputs, results);
  };

  const formatCurrency = (value: number) => {
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
        <h1 className="text-3xl font-bold text-gray-900">Investment Calculator</h1>
        <p className="text-gray-600 mt-2">
          Calculate how your investments can grow over time with compound interest.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Investment
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Number(e.target.value))}
                      leftIcon={<DollarSign size={16} className="text-gray-400" />}
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={1000}
                    max={100000}
                    step={1000}
                    value={initialInvestment}
                    onChange={setInitialInvestment}
                    formatLabel={formatCurrency}
                    color="green"
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
                    max={2000}
                    step={100}
                    value={monthlyContribution}
                    onChange={setMonthlyContribution}
                    formatLabel={formatCurrency}
                    color="green"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Interest Rate (%)
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      leftIcon={<Percent size={16} className="text-gray-400" />}
                      step="0.1"
                      min="0"
                      max="20"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={1}
                    max={12}
                    step={0.1}
                    value={interestRate}
                    onChange={setInterestRate}
                    color="green"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years to Grow
                  </label>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={yearsToGrow}
                      onChange={(e) => setYearsToGrow(Number(e.target.value))}
                      leftIcon={<Calendar size={16} className="text-gray-400" />}
                      min="1"
                      max="50"
                      className="text-right"
                    />
                  </div>
                  <Slider
                    min={1}
                    max={40}
                    step={1}
                    value={yearsToGrow}
                    onChange={setYearsToGrow}
                    color="green"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compounding Frequency
                  </label>
                  <select
                    value={compoundingFrequency}
                    onChange={(e) => setCompoundingFrequency(e.target.value)}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="annually">Annually</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="bg-green-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Investment Summary</h3>
                  
                  <div className="mb-4">
                    <div className="text-sm text-green-700 mb-1">Final Amount</div>
                    <div className="text-3xl font-bold text-green-900">
                      {formatCurrency(finalAmount)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-green-700 mb-1">Total Contributions</div>
                      <div className="text-xl font-semibold text-green-900">
                        {formatCurrency(totalContributions)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-green-700 mb-1">Total Interest</div>
                      <div className="text-xl font-semibold text-green-900">
                        {formatCurrency(totalInterestEarned)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <Button 
                    color="green"
                    fullWidth
                    icon={<Save size={16} />}
                    onClick={handleSaveCalculation}
                    title="Save this calculation"
                  >
                    Save Calculation
                  </Button>
                  
                  <Button 
                    variant="outline"
                    color="green"
                    fullWidth
                    icon={<Download size={16} />}
                    title="Download investment projection"
                  >
                    Download Projection
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card
            title="Growth Projection"
            icon={<LineChart size={20} className="text-green-600" />}
          >
            <div className="py-4">
              <LineChartComponent data={yearlyData} currency={currency} />
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Investment Growth</h4>
              
              <div className="grid grid-cols-1 gap-4 mt-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Starting with {formatCurrency(initialInvestment)}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Adding {formatCurrency(monthlyContribution)} monthly</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-700 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">At {interestRate}% interest {compoundingFrequency} compounded</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-900 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">For {yearsToGrow} years</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Growth Rate:</span>
                  <span className="text-green-600 font-medium flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    {((finalAmount / totalContributions - 1) * 100).toFixed(1)}%
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

export default InvestmentCalculator;