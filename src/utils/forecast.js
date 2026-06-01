const FIXED_CATEGORIES = ['Bills & Utilities'];
const VARIABLE_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Healthcare', 'Travel', 'Education', 'Gifts & Donations'
];

// Bug 1 fix: timezone-safe date parsing
function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function removeOutliersIQR(values) {
  // Bug 7 fix: bump threshold from < 4 to < 8
  if (values.length < 8) return values;
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;
  return values.filter(v => v >= lower && v <= upper);
}

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function getExpectedFixedBill(category, allTransactions, currentMonthStart) {
  const historical = allTransactions
    .filter(t =>
      t.category === category &&
      t.type === 'expense' &&
      parseDate(t.date) < currentMonthStart
    )
    .map(t => t.amount);

  if (historical.length === 0) return 0;
  historical.sort((a, b) => a - b);
  const mid = Math.floor(historical.length / 2);
  return historical.length % 2 === 1
    ? historical[mid]
    : (historical[mid - 1] + historical[mid]) / 2;
}

function computeWeekdayMultipliers(transactions, currentDate) {
  // Bug 9 fix: 55 days = exactly 8 weeks
  const eightWeeksAgo = new Date(currentDate);
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 55);

  const recentExpenses = transactions.filter(t =>
    t.type === 'expense' &&
    VARIABLE_CATEGORIES.includes(t.category) &&
    parseDate(t.date) >= eightWeeksAgo &&
    parseDate(t.date) <= currentDate
  );

  if (recentExpenses.length < 14) return null;

  const weekdaySums = new Array(7).fill(0);
  const weekdayCounts = new Array(7).fill(0);

  for (let d = new Date(eightWeeksAgo); d <= currentDate; d.setDate(d.getDate() + 1)) {
    weekdayCounts[d.getDay()]++;
  }

  recentExpenses.forEach(t => {
    const dow = parseDate(t.date).getDay();
    weekdaySums[dow] += t.amount;
  });

  const weekdayAvg = weekdaySums.map((sum, i) =>
    weekdayCounts[i] > 0 ? sum / weekdayCounts[i] : 0
  );

  // Bug 2 fix: don't filter out zero-spending weekdays
  const nonZeroWeekdays = weekdayAvg.filter(v => v > 0);
  if (nonZeroWeekdays.length === 0) return null;
  const overallAvg = mean(nonZeroWeekdays);

  return weekdayAvg.map(avg => avg / overallAvg);
}

export function calculateForecast(transactions, currentBalance, currentDate = new Date()) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const remainingDays = totalDays - currentDay;

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  const currentMonthTxns = transactions.filter(t => {
    const d = parseDate(t.date);
    return d >= monthStart && d < monthEnd;
  });

  const variableTxns = currentMonthTxns.filter(t =>
    t.type === 'expense' && VARIABLE_CATEGORIES.includes(t.category)
  );

  // Bug 4 fix: build calendar-aware daily totals (include zeros)
  const dailyTotals = new Array(totalDays + 1).fill(0);
  variableTxns.forEach(t => {
    const day = parseDate(t.date).getDate();
    if (day >= 1 && day <= totalDays) {
      dailyTotals[day] += t.amount;
    }
  });

  // Bug 4 fix: use all calendar days up to currentDay (including zeros)
  const allDailyTotals = dailyTotals.slice(1, currentDay + 1);
  const nonZeroTotals = allDailyTotals.filter(v => v > 0);
  const cleanedDaily = removeOutliersIQR(allDailyTotals);

  let dailySpending;
  if (cleanedDaily.length < 3) {
    dailySpending = nonZeroTotals.length > 0 ? mean(nonZeroTotals) : 0;
  } else {
    const slowAverage = mean(cleanedDaily);
    // Bug 4 fix: recent14 now operates on calendar-aware array
    const recent14 = cleanedDaily.slice(-14);
    const fastAverage = mean(recent14);
    dailySpending = 0.6 * slowAverage + 0.4 * fastAverage;
  }

  const weekdayMultipliers = computeWeekdayMultipliers(transactions, currentDate);

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

  const fixedBillsPending = [];
  let projectedFixedOutflow = 0;
  for (const category of FIXED_CATEGORIES) {
    const alreadyPaid = currentMonthTxns.some(t =>
      t.category === category &&
      t.type === 'expense' &&
      parseDate(t.date).getDate() <= currentDay
    );
    if (!alreadyPaid) {
      const expected = getExpectedFixedBill(category, transactions, monthStart);
      if (expected > 0) {
        fixedBillsPending.push({ category, amount: expected });
        projectedFixedOutflow += expected;
      }
    }
  }

  // Bug 6 fix: calculate both logged and projected income
  const currentMonthIncome = currentMonthTxns
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Project income from historical pattern (same method as expenses)
  const monthlyIncomeTotals = [];
  const monthlyIncomeDays = [];
  for (let m = 1; m <= 3; m++) {
    const targetMonth = month - m;
    const targetYear = targetMonth < 0 ? year - 1 : year;
    const adjMonth = ((targetMonth % 12) + 12) % 12;
    const mStart = new Date(targetYear, adjMonth, 1);
    const mEnd = new Date(targetYear, adjMonth + 1, 1);
    const mDays = new Date(targetYear, adjMonth + 1, 0).getDate();

    const mIncome = transactions
      .filter(t =>
        t.type === 'income' &&
        parseDate(t.date) >= mStart &&
        parseDate(t.date) < mEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);

    if (mIncome > 0) {
      monthlyIncomeTotals.push(mIncome);
      monthlyIncomeDays.push(mDays);
    }
  }

  const historicalDailyIncome = monthlyIncomeDays.length > 0
    ? monthlyIncomeTotals.reduce((s, v, i) => s + v / monthlyIncomeDays[i], 0) / monthlyIncomeDays.length
    : 0;

  const projectedIncome = currentMonthIncome + (historicalDailyIncome * remainingDays);

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
        parseDate(t.date) >= mStart &&
        parseDate(t.date) < mEnd
      )
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyVariableTotals.push(mTotal);
  }

  // Bug 5 fix: remove dead code, use directly
  const typicalMonthlySpending = mean(monthlyVariableTotals.filter(v => v > 0));

  // Bug 3 fix: use historical typical when insufficient data for projection
  const needsMoreData = nonZeroTotals.length < 3 && typicalMonthlySpending > 0;
  const projectedMonthlySpending = needsMoreData
    ? typicalMonthlySpending
    : dailySpending * totalDays;

  const spendingPacePercent = typicalMonthlySpending > 0
    ? Math.round((projectedMonthlySpending / typicalMonthlySpending) * 100)
    : 0;
  const isOverspending = spendingPacePercent > 115;

  const projectedBalance = currentBalance + projectedIncome
    - remainingVariableSpending - projectedFixedOutflow;

  return {
    dailySpending,
    projectedBalance,
    fixedBillsPending,
    isOverspending,
    spendingPacePercent,
    typicalMonthlySpending,
    projectedMonthlySpending,
    needsMoreData,
    remainingDays
  };
}
