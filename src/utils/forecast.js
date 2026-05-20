export function calculateForecast(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      currentBalance: 0,
      projectedBalance: 0,
      dailyAverage: 0,
      daysRemaining: 0
    };
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();

  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === currentYear &&
      transactionDate.getMonth() === currentMonth
    );
  });

  let totalIncome = 0;
  let totalExpenses = 0;

  currentMonthTransactions.forEach(transaction => {
    if (transaction.type === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpenses += transaction.amount;
    }
  });

  const currentBalance = totalIncome - totalExpenses;
  const daysElapsed = today.getDate();
  const daysRemaining = daysInMonth - daysElapsed;
  const dailyAverage = daysElapsed > 0 ? totalExpenses / daysElapsed : 0;
  const projectedExpense = dailyAverage * daysRemaining;
  const projectedBalance = currentBalance - projectedExpense;

  return {
    currentBalance,
    projectedBalance,
    dailyAverage,
    daysRemaining
  };
}
