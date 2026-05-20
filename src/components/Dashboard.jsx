import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import TransactionForm from './TransactionForm';
import History from './History';
import Forecast from './Forecast';
import BackupRestore from './BackupRestore';
import PasswordManager from './PasswordManager';

const Dashboard = ({ onLogout }) => {
  const [balance, setBalance] = useState({ income: 0, expenses: 0, balance: 0 });

  // Calculate current balance
  useEffect(() => {
    const calculateBalance = async () => {
      try {
        // Get all transactions
        const transactions = await db.transactions.toArray();

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(transaction => {
          if (transaction.type === 'income') {
            totalIncome += transaction.amount;
          } else {
            totalExpenses += transaction.amount;
          }
        });

        const currentBalance = totalIncome - totalExpenses;

        setBalance({
          income: totalIncome,
          expenses: totalExpenses,
          balance: currentBalance
        });
      } catch (error) {
        console.error('Error calculating balance:', error);
      }
    };

    calculateBalance();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Money Vault</h1>
        <button onClick={onLogout} className="logout-button">
          Lock
        </button>
      </div>

      <div className="balance-summary">
        <div className="balance-item">
          <span className="label">Total Balance</span>
          <span className="value">{formatCurrency(balance.balance)}</span>
        </div>
        <div className="balance-item">
          <span className="label">Income</span>
          <span className="value income">{formatCurrency(balance.income)}</span>
        </div>
        <div className="balance-item">
          <span className="label">Expenses</span>
          <span className="value expense">{formatCurrency(balance.expenses)}</span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <TransactionForm />
          <PasswordManager />
          <BackupRestore />
        </div>
        <div className="right-column">
          <Forecast />
          <History />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;