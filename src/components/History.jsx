import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { getSessionKey, decryptTransactionFromStorage } from '../crypto/crypto';
import { useCurrency } from '../context/CurrencyContext';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const key = getSessionKey();
        if (!key) {
          setError('Session expired. Please unlock again.');
          setLoading(false);
          return;
        }

        const allEncrypted = await db.transactions.toArray();
        const decrypted = [];
        for (const enc of allEncrypted) {
          try {
            const tx = await decryptTransactionFromStorage(enc, key);
            tx.id = enc.id; // preserve Dexie auto-increment id
            decrypted.push(tx);
          } catch {
            // Skip corrupted entries
          }
        }
        setTransactions(decrypted);
        setLoading(false);
      } catch {
        setError('Failed to load transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-date">
                {formatDate(transaction.date)}
              </div>
              <div className="transaction-details">
                <div className="transaction-amount">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
                <div className="transaction-category">
                  {transaction.category}
                </div>
                {transaction.note && (
                  <div className="transaction-note">
                    {transaction.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
