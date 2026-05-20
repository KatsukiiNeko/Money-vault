import React, { useState, useEffect } from 'react';
import { calculateForecast } from '../utils/forecast';
import { db } from '../db/db';

const Forecast = () => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForecast = async () => {
      try {
        // Get all transactions
        const transactions = await db.transactions.toArray();

        // Calculate forecast data
        const forecast = calculateForecast(transactions);
        setForecastData(forecast);
        setLoading(false);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setLoading(false);
      }
    };

    loadForecast();
  }, []);

  if (loading) {
    return <div className="forecast">Loading forecast data...</div>;
  }

  if (!forecastData) {
    return <div className="forecast">Loading...</div>;
  }

  return (
    <div className="forecast-container">
      <h2>Monthly Forecast</h2>
      <div className="forecast-content">
        <div className="forecast-item">
          <span className="label">Current Balance:</span>
          <span className="value">${forecastData.currentBalance.toFixed(2)}</span>
        </div>
        <div className="forecast-item">
          <span className="label">Projected End-of-Month Balance:</span>
          <span className="value">${forecastData.projectedBalance.toFixed(2)}</span>
        </div>
        <div className="forecast-item">
          <span className="label">Daily Average Spending:</span>
          <span className="value">${forecastData.dailyAverage.toFixed(2)}/day</span>
        </div>
        <div className="forecast-item">
          <span className="label">Days Remaining:</span>
          <span className="value">{forecastData.daysRemaining} days</span>
        </div>
      </div>
    </div>
  );
};

export default Forecast;