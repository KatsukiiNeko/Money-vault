import { useState, useEffect } from 'react';
import { db } from '../db/db';
import { getSessionKey, decryptTransactionFromStorage, encryptData, decryptData, generateIV, getActiveAccountId, createSecureBackup, restoreSecureBackup, parseSecureBackup } from '../crypto/crypto';
import TransactionForm from './TransactionForm';
import History from './History';
import Forecast from './Forecast';
import BackupRestore from './BackupRestore';
import PasswordManager from './PasswordManager';
import CurrencyToggle from './CurrencyToggle';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = ({ onLogout, onSwitchAccount }) => {
  const [balance, setBalance] = useState({ income: 0, expenses: 0, balance: 0 });
  const [refreshKey, setRefreshKey] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editValue, setEditValue] = useState('');
  const { formatCurrency } = useCurrency();
  const { t } = useLanguage();

  const accountId = getActiveAccountId();

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const account = await db.accounts.get(accountId);
        if (account) setAccountName(account.name);
      } catch { /* account not found */ }
    };
    loadAccount();
  }, [accountId]);

  useEffect(() => {
    const calculateBalance = async () => {
      try {
        const key = getSessionKey();
        if (!key) return;

        const allEncrypted = await db.transactions.where('accountId').equals(accountId).toArray();
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
            // Skip undecryptable transactions
          }
        }

        setBalance({
          income: totalIncome,
          expenses: totalExpenses,
          balance: totalIncome - totalExpenses
        });
      } catch { /* balance calc failed */ }
    };

    calculateBalance();
  }, [refreshKey, accountId]);

  const handleRename = async () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === accountName) {
      setEditingName(false);
      return;
    }
    try {
      await db.accounts.update(accountId, { name: trimmed });
      setAccountName(trimmed);
    } catch { /* rename failed */ }
    setEditingName(false);
  };

  const startEditing = () => {
    setEditValue(accountName);
    setEditingName(true);
  };

  const handleTransactionAdded = () => {
    setRefreshKey(k => k + 1);
  };

  const downloadBackup = (backup, suffix) => {
    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `money-vault-${suffix}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBackup = async () => {
    const key = getSessionKey();
    if (!key) throw new Error(t('dashboard.sessionExpired'));

    const allEncrypted = await db.transactions.where('accountId').equals(accountId).toArray();

    const backupData = {
      transactions: allEncrypted,
      timestamp: new Date().toISOString(),
      version: 2
    };

    const iv = generateIV();
    const jsonString = JSON.stringify(backupData);
    const encrypted = await encryptData(jsonString, key, iv);

    const backup = {
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encrypted)),
      version: 2,
      algorithm: 'AES-GCM-256'
    };

    downloadBackup(backup, 'backup');
  };

  const handleSecureBackup = async (password) => {
    const backup = await createSecureBackup(password, accountId);
    downloadBackup(backup, 'secure-backup');
  };

  const readBackupFile = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) { reject(new Error(t('dashboard.noFileSelected'))); return; }
        try {
          const text = await file.text();
          const backup = JSON.parse(text);
          resolve(backup);
        } catch {
          reject(new Error(t('dashboard.invalidBackupFormat')));
        }
      };
      input.click();
    });
  };

  const handleRestore = async () => {
    const key = getSessionKey();
    if (!key) throw new Error(t('dashboard.sessionExpired'));

    const backup = await readBackupFile();

    // Auto-detect format
    if (backup.version === 3) {
      // v3 secure backup — needs password, return metadata for UI to prompt
      const meta = await parseSecureBackup(backup);
      return { format: 'secure', meta, backup };
    }

    if (backup.version === 2 || !backup.version) {
      // v2 quick backup — use session key
      if (!backup.iv || !backup.ciphertext) {
        throw new Error(t('dashboard.invalidBackupFormat'));
      }

      const iv = new Uint8Array(backup.iv);
      const ciphertext = new Uint8Array(backup.ciphertext);
      const decrypted = await decryptData(ciphertext, key, iv);
      const backupData = JSON.parse(decrypted);

      if (!backupData.transactions || !Array.isArray(backupData.transactions)) {
        throw new Error(t('dashboard.invalidBackupData'));
      }

      const transactionsWithAccount = backupData.transactions.map(tx => ({
        ...tx,
        accountId
      }));

      await db.transaction('rw', db.transactions, async () => {
        await db.transactions.where('accountId').equals(accountId).delete();
        await db.transactions.bulkAdd(transactionsWithAccount);
      });

      setRefreshKey(k => k + 1);
      return { format: 'quick', count: transactionsWithAccount.length };
    }

    if (backup.version === 1) {
      // v1 legacy — needs password
      return { format: 'legacy', backup };
    }

    throw new Error(t('dashboard.invalidBackupFormat'));
  };

  const handleSecureRestore = async (backup, password) => {
    const count = await restoreSecureBackup(backup, password, accountId);
    setRefreshKey(k => k + 1);
    return count;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title-row">
          <h1>{t('dashboard.title')}</h1>
          {editingName ? (
            <div className="account-edit-inline">
              <input
                className="account-edit-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setEditingName(false);
                }}
                onBlur={handleRename}
                autoFocus
                maxLength={50}
              />
            </div>
          ) : (
            <button className="account-name-badge" onClick={startEditing}>
              <span>{accountName}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>
        <div className="header-controls">
          <ThemeToggle />
          <LanguageToggle />
          <CurrencyToggle />
          <button onClick={onSwitchAccount} className="switch-account-button">
            {t('accounts.switch')}
          </button>
          <button onClick={onLogout} className="logout-button">
            {t('dashboard.lock')}
          </button>
        </div>
      </div>

      <div className="balance-summary">
        <div className="balance-item">
          <span className="label">{t('dashboard.totalBalance')}</span>
          <span className="value">{formatCurrency(balance.balance)}</span>
        </div>
        <div className="balance-item">
          <span className="label">{t('dashboard.income')}</span>
          <span className="value income">{formatCurrency(balance.income)}</span>
        </div>
        <div className="balance-item">
          <span className="label">{t('dashboard.expenses')}</span>
          <span className="value expense">{formatCurrency(balance.expenses)}</span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-column">
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
          <PasswordManager />
          <BackupRestore onBackup={handleBackup} onSecureBackup={handleSecureBackup} onRestore={handleRestore} onSecureRestore={handleSecureRestore} />
        </div>
        <div className="right-column">
          <Forecast currentBalance={balance.balance} />
          <History key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
