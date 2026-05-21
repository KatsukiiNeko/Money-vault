// Category classification (must match values stored in IndexedDB from TransactionForm)
const FIXED_CATEGORIES = ['Bills & Utilities'];
const VARIABLE_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Healthcare', 'Travel', 'Education', 'Gifts & Donations'
];

// Remove outliers using IQR method
function removeOutliersIQR(values) {
  if (values.length < 4) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return values.filter(v => v >= lower && v <= upper);
}

// Exponentially Weighted Moving Average (recency-biased)
function computeEWMA(dailyValues, alpha = 0.3) {
  if (dailyValues.length === 0) return 0;
  let weightedSum = 0;
  let weightSum = 0;
  let decay = 1;
  for (let i = dailyValues.length - 1; i >= 0; i--) {
    weightedSum += dailyValues[i] * decay;
    weightSum += decay;
    decay *= (1 - alpha);
  }
  return weightSum === 0 ? 0 : weightedSum / weightSum;
}

// Predict fixed bill amount based on historical median
function getExpectedFixedBill(category, allTransactions, currentMonthStart) {
  const historical = allTransactions
    .filter(t =>
      t.category === category &&
      t.type === 'expense' &&
      new Date(t.date) < currentMonthStart
    )
    .map(t => t.amount);

  if (historical.length === 0) return 0;
  historical.sort((a, b) => a - b);
  const mid = Math.floor(historical.length / 2);
  return historical.length % 2 === 1
    ? historical[mid]
    : (historical[mid - 1] + historical[mid]) / 2;
}

/**
 * Calculate adaptive forecast
 * @param {Array} transactions - all account transactions (decrypted, unfiltered)
 * @param {number} currentBalance - current net balance (income - expense) from dashboard
 * @param {Date} currentDate - optional, defaults to today
 * @returns {Object} { dailySpending, projectedBalance, fixedBillsPending, totalDays, remainingDays, currentDay }
 */
export function calculateForecast(transactions, currentBalance, currentDate = new Date()) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const remainingDays = totalDays - currentDay;

  // Current month boundaries
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  // Filter to current month transactions
  const currentMonthTxns = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= monthStart && d < monthEnd;
  });

  // Variable daily spending calculation
  const variableTxns = currentMonthTxns.filter(t =>
    t.type === 'expense' && VARIABLE_CATEGORIES.includes(t.category)
  );

  // Build daily totals (1-indexed, index 0 unused)
  const dailyTotals = new Array(currentDay + 1).fill(0);
  variableTxns.forEach(t => {
    const day = new Date(t.date).getDate();
    if (day <= currentDay) {
      dailyTotals[day] += t.amount;
    }
  });

  // Extract non-zero daily totals for IQR filtering
  const nonZeroTotals = dailyTotals.slice(1).filter(v => v > 0);
  const cleanedDaily = removeOutliersIQR(nonZeroTotals);

  // EWMA on cleaned active-day spending
  const dailySpending = computeEWMA(cleanedDaily);
  const projectedVariableSpending = dailySpending * remainingDays;

  // Fixed bills detection
  const fixedBillsPending = [];
  let projectedFixedOutflow = 0;
  for (const category of FIXED_CATEGORIES) {
    const alreadyPaid = currentMonthTxns.some(t =>
      t.category === category &&
      t.type === 'expense' &&
      new Date(t.date).getDate() <= currentDay
    );
    if (!alreadyPaid) {
      const expected = getExpectedFixedBill(category, transactions, monthStart);
      if (expected > 0) {
        fixedBillsPending.push({ category, amount: expected });
        projectedFixedOutflow += expected;
      }
    }
  }

  // Projected end-of-month balance (current balance minus remaining spending)
  const projectedBalance = currentBalance
    - projectedVariableSpending - projectedFixedOutflow;

  return {
    dailySpending,
    projectedBalance,
    fixedBillsPending,
    totalDays,
    remainingDays,
    currentDay
  };
}
