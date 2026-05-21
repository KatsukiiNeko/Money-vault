import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'VND' : 'USD');
  };

  const formatCurrency = (amount) => {
    if (currency === 'VND') {
      const vndAmount = amount * 1000;
      return `${Math.round(vndAmount).toLocaleString('en-US')} VND`;
    }
    return `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} USD`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
