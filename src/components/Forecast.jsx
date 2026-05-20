import { useState, useEffect } from 'react';
import { calculateForecast } from '../utils/forecast';
import { db } from '../db/db';
import { getSessionKey, decryptTransactionFromStorage } from '../crypto/crypto';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

const Forecast = () => {
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

        const allEncrypted = await db.transactions.toArray();
        const transactions = [];
        for (const enc of allEncrypted) {
          try {
            const tx = await decryptTransactionFromStorage(enc, key);
            transactions.push(tx);
          } catch {}
        }

        const forecast = calculateForecast(transactions);
        setForecastData(forecast);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    loadForecast();
  }, []);

  if (loading) {
    return <div className="forecast">{t('forecast.loading')}</div>;
  }

  if (!forecastData) {
    return <div className="forecast">{t('forecast.noData')}</div>;
  }

  return (
    <div className="forecast-container">
      <h2>{t('forecast.title')}</h2>
      <div className="forecast-content">
        <div className="forecast-item">
          <span className="label">{t('forecast.currentBalance')}</span>
          <span className="value">{formatCurrency(forecastData.currentBalance)}</span>
        </div>
        <div className="forecast-item">
          <span className="label">{t('forecast.projectedBalance')}</span>
          <span className="value">{formatCurrency(forecastData.projectedBalance)}</span>
        </div>
        <div className="forecast-item">
          <span className="label">{t('forecast.dailyAverage')}</span>
          <span className="value">{formatCurrency(forecastData.dailyAverage)}{t('forecast.perDay')}</span>
        </div>
        <div className="forecast-item">
          <span className="label">{t('forecast.daysRemaining')}</span>
          <span className="value">{forecastData.daysRemaining} {t('forecast.days')}</span>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
