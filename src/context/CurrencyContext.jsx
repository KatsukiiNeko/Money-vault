import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    try {
      return localStorage.getItem('money-vault-currency') || 'USD';
    } catch {
      return 'USD';
    }
  });

  const toggleCurrency = () => {
    setCurrency(prev => {
      const next = prev === 'USD' ? 'VND' : 'USD';
      try { localStorage.setItem('money-vault-currency', next); } catch {}
      return next;
    });
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
