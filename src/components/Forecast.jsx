import { useState, useEffect } from 'react';
import { calculateForecast } from '../utils/forecast';
import { db } from '../db/db';
import { getSessionKey, decryptTransactionFromStorage, getActiveAccountId } from '../crypto/crypto';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const Forecast = ({ currentBalance = 0 }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();
  const { t } = useLanguage();

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const key = getSessionKey();
        if (!key) {
          setLoading(false);
          return;
        }

        const allEncrypted = await db.transactions.where('accountId').equals(getActiveAccountId()).toArray();
        const transactions = [];
        for (const enc of allEncrypted) {
          try {
            const tx = await decryptTransactionFromStorage(enc, key);
            transactions.push(tx);
          } catch {
            // Skip undecryptable transactions
          }
        }

        const forecast = calculateForecast(transactions, currentBalance);
        setForecastData(forecast);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    loadForecast();
  }, [currentBalance]);

  if (loading) {
    return <div className="forecast">{t('forecast.loading')}</div>;
  }

  if (!forecastData || (forecastData.typicalMonthlySpending === 0 && forecastData.dailySpending === 0)) {
    return (
      <div className="forecast-container">
        <h2>{t('forecast.title')}</h2>
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h4>{t('empty.forecast.title')}</h4>
          <p>{t('empty.forecast.desc')}</p>
        </div>
      </div>
    );
  }

  const remainingDays = (() => {
    const now = new Date();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return totalDays - now.getDate();
  })();

  const pacePercent = forecastData.spendingPacePercent || 0;
  const isOverspending = forecastData.isOverspending;

  return (
    <div className="forecast-container">
      <h2>{t('forecast.title')}</h2>
      <div className="forecast-content">
        <div className="forecast-item">
          <span className="label">{t('forecast.currentBalance')}</span>
          <span className="value">{formatCurrency(currentBalance)}</span>
        </div>
        <div className="forecast-item">
          <span className="label">{t('forecast.projectedBalance')}</span>
          <span className="value">{forecastData.projectedBalance !== undefined ? formatCurrency(forecastData.projectedBalance) : t('forecast.noData')}</span>
        </div>
        <div className="forecast-item">
          <span className="label">{t('forecast.dailyAverage')}</span>
          <span className="value">{forecastData.dailySpending !== undefined ? formatCurrency(forecastData.dailySpending) + t('forecast.perDay') : t('forecast.noData')}</span>
        </div>
        <div className="forecast-item">
          <span className="label">{t('forecast.daysRemaining')}</span>
          <span className="value">{remainingDays} {t('forecast.days')}</span>
        </div>
        {forecastData.typicalMonthlySpending > 0 ? (
          <>
            <div className={`forecast-item forecast-status ${isOverspending ? 'overspending' : 'on-track'}`}>
              <span className="label">{t('forecast.spendingPace')}</span>
              <span className="value">
                {pacePercent > 0 ? pacePercent + '% — ' : ''}
                {isOverspending ? t('forecast.overspending') : t('forecast.onTrack')}
              </span>
              <div className="pace-bar-track">
                <div
                  className={`pace-bar-fill ${isOverspending ? 'overspending' : 'on-track'}`}
                  style={{ width: `${Math.min(pacePercent, 120)}%` }}
                />
              </div>
            </div>
            <div className="forecast-item">
              <span className="label">{t('forecast.typicalSpending')}</span>
              <span className="value">{formatCurrency(forecastData.typicalMonthlySpending)}</span>
            </div>
            <div className="forecast-item">
              <span className="label">{t('forecast.projectedSpending')}</span>
              <span className="value">{forecastData.projectedMonthlySpending !== undefined ? formatCurrency(forecastData.projectedMonthlySpending) : t('forecast.noData')}</span>
            </div>
          </>
        ) : (
          <div className="forecast-item">
            <span className="label">{t('forecast.spendingPace')}</span>
            <span className="value forecast-na">{t('forecast.noBaseline')}</span>
          </div>
        )}

        {forecastData.fixedBillsPending && forecastData.fixedBillsPending.length > 0 && (
          <div className="fixed-bills-section">
            <div className="fixed-bills-title">{t('forecast.fixedBills')}</div>
            {forecastData.fixedBillsPending.map((bill, i) => (
              <div key={i} className="fixed-bill-item">
                <span className="bill-name">{t('forecast.fixedBillsPending')}</span>
                <span className="bill-amount">{formatCurrency(bill.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forecast;
