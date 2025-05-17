import React, { useState } from 'react';
import { TrendingUp, ArrowRight, Save } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LineChartComponent from '../charts/LineChart';
import { useCalculation } from '../../context/CalculationContext';

interface Scenario {
  name: string;
  initialInvestment: number;
  monthlyContribution: number;
  interestRate: number;
  years: number;
  results: {
    finalAmount: number;
    totalContributions: number;
    totalInterest: number;
    timeline: Array<{ year: number; value: number }>;
  };
}

const ScenarioSimulator: React.FC = () => {
  const { currency } = useCalculation();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Partial<Scenario>>({
    name: '',
    initialInvestment: 10000,
    monthlyContribution: 500,
    interestRate: 7,
    years: 20
  });

  const calculateResults = (scenario: Partial<Scenario>) => {
    const timeline = [];
    let balance = scenario.initialInvestment || 0;
    const monthlyRate = (scenario.interestRate || 0) / 100 / 12;
    const totalMonths = (scenario.years || 0) * 12;
    const monthlyContribution = scenario.monthlyContribution || 0;

    for (let month = 0; month <= totalMonths; month++) {
      if (month % 12 === 0) {
        timeline.push({
          year: month / 12,
          value: balance
        });
      }
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }

    const totalContributions = (scenario.initialInvestment || 0) + 
      (monthlyContribution * totalMonths);

    return {
      finalAmount: balance,
      totalContributions,
      totalInterest: balance - totalContributions,
      timeline
    };
  };

  const addScenario = () => {
    if (!currentScenario.name) return;

    const results = calculateResults(currentScenario);
    const newScenario: Scenario = {
      ...currentScenario as Scenario,
      results
    };

    setScenarios([...scenarios, newScenario]);
    setCurrentScenario({
      name: '',
      initialInvestment: 10000,
      monthlyContribution: 500,
      interestRate: 7,
      years: 20
    });
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
    <div className="container mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scenario Simulator</h1>
        <p className="text-gray-600 mt-2">
          Compare different financial scenarios and visualize potential outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <Input
                    label="Scenario Name"
                    value={currentScenario.name}
                    onChange={(e) => setCurrentScenario({
                      ...currentScenario,
                      name: e.target.value
                    })}
                    placeholder="e.g., Conservative Investment"
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="Initial Investment"
                    type="number"
                    value={currentScenario.initialInvestment}
                    onChange={(e) => setCurrentScenario({
                      ...currentScenario,
                      initialInvestment: Number(e.target.value)
                    })}
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="Monthly Contribution"
                    type="number"
                    value={currentScenario.monthlyContribution}
                    onChange={(e) => setCurrentScenario({
                      ...currentScenario,
                      monthlyContribution: Number(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <Input
                    label="Interest Rate (%)"
                    type="number"
                    value={currentScenario.interestRate}
                    onChange={(e) => setCurrentScenario({
                      ...currentScenario,
                      interestRate: Number(e.target.value)
                    })}
                    step="0.1"
                  />
                </div>

                <div className="mb-4">
                  <Input
                    label="Years"
                    type="number"
                    value={currentScenario.years}
                    onChange={(e) => setCurrentScenario({
                      ...currentScenario,
                      years: Number(e.target.value)
                    })}
                  />
                </div>

                <Button
                  color="indigo"
                  fullWidth
                  onClick={addScenario}
                  disabled={!currentScenario.name}
                  icon={<Save size={16} />}
                >
                  Add Scenario
                </Button>
              </div>
            </div>
          </Card>

          {scenarios.length > 0 && (
            <Card className="mt-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Comparison Chart</h2>
              </div>
              <LineChartComponent
                data={scenarios[scenarios.length - 1].results.timeline}
                currency={currency}
              />
            </Card>
          )}
        </div>

        <div>
          <Card title="Saved Scenarios" icon={<TrendingUp size={20} className="text-indigo-600" />}>
            {scenarios.length > 0 ? (
              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{scenario.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        Initial: {formatCurrency(scenario.initialInvestment)}
                      </p>
                      <p className="text-gray-600">
                        Monthly: {formatCurrency(scenario.monthlyContribution)}
                      </p>
                      <p className="text-gray-600">
                        Rate: {scenario.interestRate}%
                      </p>
                      <p className="text-gray-600">
                        Years: {scenario.years}
                      </p>
                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <p className="text-indigo-600 font-medium">
                          Final Amount: {formatCurrency(scenario.results.finalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No scenarios created yet. Add your first scenario to start comparing.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;