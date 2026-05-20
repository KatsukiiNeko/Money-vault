import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { getSessionKey, decryptTransactionFromStorage, encryptData, decryptData, generateIV } from '../crypto/crypto';
import { useCurrency } from '../context/CurrencyContext';
import TransactionForm from './TransactionForm';
import History from './History';
import Forecast from './Forecast';
import BackupRestore from './BackupRestore';
import PasswordManager from './PasswordManager';
import CurrencyToggle from './CurrencyToggle';

const Dashboard = ({ onLogout }) => {
  const [balance, setBalance] = useState({ income: 0, expenses: 0, balance: 0 });
  const [refreshKey, setRefreshKey] = useState(0);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const calculateBalance = async () => {
      try {
        const key = getSessionKey();
        if (!key) return;

        const allEncrypted = await db.transactions.toArray();
        let totalIncome = 0;
        let totalExpenses = 0;

        for (const enc of allEncrypted) {
          try {
            const tx = await decryptTransactionFromStorage(enc, key);
            if (tx.type === 'income') {
              totalIncome += tx.amount;
            } else {
              totalExpenses += tx.amount;
            }
          } catch {
            // Skip corrupted entries
          }
        }

        setBalance({
          income: totalIncome,
          expenses: totalExpenses,
          balance: totalIncome - totalExpenses
        });
      } catch {
        // Error calculating balance
      }
    };

    calculateBalance();
  }, [refreshKey]);

  const handleTransactionAdded = () => {
    setRefreshKey(k => k + 1);
  };

  const handleBackup = async () => {
    const key = getSessionKey();
    if (!key) throw new Error('Session expired');

    // Get all encrypted transactions as-is for backup
    const allEncrypted = await db.transactions.toArray();

    // Re-encrypt with a backup-specific key derived from a backup password
    // For simplicity, we back up the raw encrypted blobs with metadata
    const backupData = {
      transactions: allEncrypted,
      timestamp: new Date().toISOString(),
      version: 1
    };

    // Encrypt the entire backup with the session key
    const iv = generateIV();
    const jsonString = JSON.stringify(backupData);
    const encrypted = await encryptData(jsonString, key, iv);

    const backup = {
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encrypted)),
      version: 1,
      algorithm: 'AES-GCM-256'
    };

    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `money-vault-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = async () => {
    const key = getSessionKey();
    if (!key) throw new Error('Session expired');

    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) { reject(new Error('No file selected')); return; }

        try {
          const text = await file.text();
          const backup = JSON.parse(text);

          if (!backup.iv || !backup.ciphertext) {
            throw new Error('Invalid backup file format');
          }

          const iv = new Uint8Array(backup.iv);

          const ciphertext = new Uint8Array(backup.ciphertext);
          const decrypted = await decryptData(ciphertext, key, iv);
          const backupData = JSON.parse(decrypted);

          if (!backupData.transactions || !Array.isArray(backupData.transactions)) {
            throw new Error('Invalid backup data structure');
          }

          // Clear existing and restore
          await db.transactions.clear();
          await db.transactions.bulkAdd(backupData.transactions);

          setRefreshKey(k => k + 1);
          resolve();
        } catch (err) {
          reject(new Error('Failed to restore: ' + err.message));
        }
      };
      input.click();
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Money Vault</h1>
        <div className="header-controls">
          <CurrencyToggle />
          <button onClick={onLogout} className="logout-button">
            Lock
          </button>
        </div>
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
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
          <PasswordManager />
          <BackupRestore onBackup={handleBackup} onRestore={handleRestore} />
        </div>
        <div className="right-column">
          <Forecast />
          <History key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
