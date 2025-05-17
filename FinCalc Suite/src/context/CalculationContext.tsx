import React, { createContext, useState, useContext, ReactNode } from 'react';

type CalculationHistory = {
  id: string;
  type: string;
  date: Date;
  inputs: Record<string, any>;
  results: Record<string, any>;
};

interface CalculationContextType {
  calculationHistory: CalculationHistory[];
  addCalculation: (type: string, inputs: Record<string, any>, results: Record<string, any>) => void;
  clearHistory: () => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export const useCalculation = () => {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }
  return context;
};

export const CalculationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
  const [currency, setCurrency] = useState<string>('USD');

  const addCalculation = (
    type: string, 
    inputs: Record<string, any>, 
    results: Record<string, any>
  ) => {
    const newCalculation: CalculationHistory = {
      id: Date.now().toString(),
      type,
      date: new Date(),
      inputs,
      results
    };
    
    setCalculationHistory(prev => [newCalculation, ...prev]);
  };

  const clearHistory = () => {
    setCalculationHistory([]);
  };

  return (
    <CalculationContext.Provider 
      value={{ 
        calculationHistory, 
        addCalculation, 
        clearHistory,
        currency,
        setCurrency
      }}
    >
      {children}
    </CalculationContext.Provider>
  );
};