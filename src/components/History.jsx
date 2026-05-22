import { useState, useEffect } from 'react';
import { db } from '../db/db';
import { getSessionKey, decryptTransactionFromStorage, getActiveAccountId } from '../crypto/crypto';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { categoryValueToKey } from '../i18n/translations';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { formatCurrency } = useCurrency();
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const key = getSessionKey();
        if (!key) {
          setError(t('history.errors.sessionExpired'));
          setLoading(false);
          return;
        }

        const allEncrypted = await db.transactions.where('accountId').equals(getActiveAccountId()).toArray();
        const decrypted = [];
        for (const enc of allEncrypted) {
          try {
            const tx = await decryptTransactionFromStorage(enc, key);
            tx.id = enc.id;
            decrypted.push(tx);
          } catch {
            // Skip undecryptable transactions
          }
        }
        setTransactions(decrypted);
        setLoading(false);
      } catch {
        setError(t('history.errors.loadFailed'));
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [t]);

  const handleDelete = async (id) => {
    try {
      await db.transactions.delete(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      setDeletingId(null);
    } catch {
      setError(t('history.errors.deleteFailed'));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = language === 'EN' ? 'en-US' : 'vi-VN';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">{t('history.loading')}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="transaction-history">
      <h2>{t('history.title')}</h2>

      {transactions.length === 0 ? (
        <div className="no-transactions">
          <p>{t('history.empty')}</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className={`transaction-item ${deletingId === transaction.id ? 'deleting' : ''}`}>
              <div className="transaction-left">
                <div className="transaction-date">
                  {formatDate(transaction.date)}
                </div>
                <div className="transaction-info">
                  <div className="transaction-category">
                    {categoryValueToKey[transaction.category] ? t(categoryValueToKey[transaction.category]) : transaction.category}
                  </div>
                  {transaction.note && (
                    <div className="transaction-note">
                      {transaction.note}
                    </div>
                  )}
                </div>
              </div>
              <div className="transaction-right">
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </div>
                {deletingId === transaction.id ? (
                  <div className="delete-confirm-inline">
                    <button
                      className="delete-confirm-btn-inline confirm"
                      onClick={() => handleDelete(transaction.id)}
                      title={t('history.deleteConfirm')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button
                      className="delete-confirm-btn-inline cancel"
                      onClick={() => setDeletingId(null)}
                      title={t('accounts.cancel')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    className="transaction-delete-btn"
                    onClick={() => setDeletingId(transaction.id)}
                    title={t('history.delete')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
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
