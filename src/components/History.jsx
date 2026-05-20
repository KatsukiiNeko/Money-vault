import { useState, useEffect } from 'react';
import { db } from '../db/db';
import { getSessionKey, decryptTransactionFromStorage } from '../crypto/crypto';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { categoryValueToKey } from '../i18n/translations';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

        const allEncrypted = await db.transactions.toArray();
        const decrypted = [];
        for (const enc of allEncrypted) {
          try {
            const tx = await decryptTransactionFromStorage(enc, key);
            tx.id = enc.id;
            decrypted.push(tx);
          } catch {}
        }
        setTransactions(decrypted);
        setLoading(false);
      } catch {
        setError(t('history.errors.loadFailed'));
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-left">
                <div className="transaction-date">
                  {formatDate(transaction.date)}
                </div>
                <div className="transaction-info">
                  <div className="transaction-category">
                    {categoryValueToKey[transaction.category] ? t(`cat.${categoryValueToKey[transaction.category]}`) : transaction.category}
                  </div>
                  {transaction.note && (
                    <div className="transaction-note">
                      {transaction.note}
                    </div>
                  )}
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
