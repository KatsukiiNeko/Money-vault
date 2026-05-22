// Category classification (must match values stored in IndexedDB from TransactionForm)
const FIXED_CATEGORIES = ['Bills & Utilities'];
const VARIABLE_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Healthcare', 'Travel', 'Education', 'Gifts & Donations'
];

/**
 * Remove outliers using IQR method
 * @param {number[]} values
 * @returns {number[]}
 */
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

/**
 * Compute mean of an array
 * @param {number[]} arr
 * @returns {number}
 */
function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

/**
 * Predict fixed bill amount based on historical median
 * @param {string} category
 * @param {Array} allTransactions
 * @param {Date} currentMonthStart
 * @returns {number}
 */
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
 * Compute day-of-week spending multipliers over the last 8 weeks
 * Returns an array of 7 multipliers (0=Sun..6=Sat), or null if sparse data
 * @param {Array} transactions - all transactions
 * @param {Date} currentDate
 * @returns {number[]|null}
 */
function computeWeekdayMultipliers(transactions, currentDate) {
  const eightWeeksAgo = new Date(currentDate);
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const recentExpenses = transactions.filter(t =>
    t.type === 'expense' &&
    VARIABLE_CATEGORIES.includes(t.category) &&
    new Date(t.date) >= eightWeeksAgo &&
    new Date(t.date) <= currentDate
  );

  if (recentExpenses.length < 14) return null;

  // Sum spending per weekday and count occurrences
  const weekdaySums = new Array(7).fill(0);
  const weekdayCounts = new Array(7).fill(0);

  // Count how many of each weekday occurred in the 8-week window
  for (let d = new Date(eightWeeksAgo); d <= currentDate; d.setDate(d.getDate() + 1)) {
    weekdayCounts[d.getDay()]++;
  }

  recentExpenses.forEach(t => {
    const dow = new Date(t.date).getDay();
    weekdaySums[dow] += t.amount;
  });

  // Average per-weekday spending
  const weekdayAvg = weekdaySums.map((sum, i) =>
    weekdayCounts[i] > 0 ? sum / weekdayCounts[i] : 0
  );

  const overallAvg = mean(weekdayAvg.filter(v => v > 0));
  if (overallAvg === 0) return null;

  // Multiplier: how much more/less this weekday spends vs average
  return weekdayAvg.map(avg => avg / overallAvg);
}

/**
 * Calculate smart forecast with overspending detection
 * @param {Array} transactions - all account transactions (decrypted, unfiltered)
 * @param {number} currentBalance - current net balance (income - expense) from dashboard
 * @param {Date} currentDate - optional, defaults to today
 * @returns {{ dailySpending: number, projectedBalance: number, fixedBillsPending: Array<{category: string, amount: number}>, isOverspending: boolean, spendingPacePercent: number, typicalMonthlySpending: number, projectedMonthlySpending: number }}
 */
export function calculateForecast(transactions, currentBalance, currentDate = new Date()) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const remainingDays = totalDays - currentDay;

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  // Current month transactions
  const currentMonthTxns = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= monthStart && d < monthEnd;
  });

  // ── 1. Variable daily spending ──
  const variableTxns = currentMonthTxns.filter(t =>
    t.type === 'expense' && VARIABLE_CATEGORIES.includes(t.category)
  );

  // Build daily totals (1-indexed)
  const dailyTotals = new Array(currentDay + 1).fill(0);
  variableTxns.forEach(t => {
    const day = new Date(t.date).getDate();
    if (day <= currentDay) {
      dailyTotals[day] += t.amount;
    }
  });

  // IQR filtering on non-zero days
  const nonZeroTotals = dailyTotals.slice(1).filter(v => v > 0);
  const cleanedDaily = removeOutliersIQR(nonZeroTotals);

  // Blended average: 0.6 * long-term + 0.4 * recent (14-day)
  let dailySpending;
  if (cleanedDaily.length < 3) {
    // Sparse data: use simple mean of all non-zero days (no filtering)
    dailySpending = nonZeroTotals.length > 0 ? mean(nonZeroTotals) : 0;
  } else {
    const slowAverage = mean(cleanedDaily);
    const recent14 = cleanedDaily.slice(-14);
    const fastAverage = mean(recent14);
    dailySpending = 0.6 * slowAverage + 0.4 * fastAverage;
  }

  // ── 2. Day-of-week adjustment ──
  const weekdayMultipliers = computeWeekdayMultipliers(transactions, currentDate);

  // Compute remaining variable spending with optional weekday adjustment
  let remainingVariableSpending;
  if (weekdayMultipliers && remainingDays > 0) {
    let total = 0;
    const tempDate = new Date(currentDate);
    for (let i = 1; i <= remainingDays; i++) {
      tempDate.setDate(tempDate.getDate() + 1);
      const dow = tempDate.getDay();
      total += dailySpending * weekdayMultipliers[dow];
    }
    remainingVariableSpending = total;
  } else {
    remainingVariableSpending = dailySpending * remainingDays;
  }

  // ── 3. Fixed bills pending ──
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

  // ── 4. Projected income this month ──
  const projectedIncome = currentMonthTxns
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // ── 5. Typical monthly spending (last 3 full months avg) ──
  const monthlyVariableTotals = [];
  for (let m = 1; m <= 3; m++) {
    const targetMonth = month - m;
    const targetYear = targetMonth < 0 ? year - 1 : year;
    const adjMonth = ((targetMonth % 12) + 12) % 12;
    const mStart = new Date(targetYear, adjMonth, 1);
    const mEnd = new Date(targetYear, adjMonth + 1, 1);

    const mTotal = transactions
      .filter(t =>
        t.type === 'expense' &&
        VARIABLE_CATEGORIES.includes(t.category) &&
        new Date(t.date) >= mStart &&
        new Date(t.date) < mEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyVariableTotals.push(mTotal);
  }

  const historicalTypical = mean(monthlyVariableTotals.filter(v => v > 0));

  // Need at least 3 days of spending data AND historical baseline for pace detection
  const hasEnoughData = historicalTypical > 0 && nonZeroTotals.length >= 3;
  const typicalMonthlySpending = hasEnoughData ? historicalTypical : (historicalTypical > 0 ? historicalTypical : 0);

  // ── 6. Overspending detection ──
  const projectedMonthlySpending = dailySpending * totalDays;
  const spendingPacePercent = typicalMonthlySpending > 0
    ? Math.round((projectedMonthlySpending / typicalMonthlySpending) * 100)
    : 0;
  const isOverspending = spendingPacePercent > 115;

  // ── 7. Projected end-of-month balance ──
  const projectedBalance = currentBalance + projectedIncome
    - remainingVariableSpending - projectedFixedOutflow;

  return {
    dailySpending,
    projectedBalance,
    fixedBillsPending,
    isOverspending,
    spendingPacePercent,
    typicalMonthlySpending,
    projectedMonthlySpending
  };
}
