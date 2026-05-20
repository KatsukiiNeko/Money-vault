// Forecast utility function
export function calculateForecast(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      currentBalance: 0,
      projectedBalance: 0,
      dailyAverage: 0,
      daysRemaining: 0
    };
  }

  // Get current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Get the first day of the current month
  const firstDay = new Date(currentYear, currentMonth, 1);

  // Get the last day of the current month
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  // Calculate days in the month
  const daysInMonth = lastDay.getDate();

  // Filter transactions for the current month
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === currentYear &&
      transactionDate.getMonth() === currentMonth
    );
  });

  // Calculate current balance (income - expenses)
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

  // Calculate days elapsed in the current month
  const daysElapsed = today.getDate();
  const daysRemaining = daysInMonth - daysElapsed;

  // Calculate average daily spending
  const dailyAverage = daysElapsed > 0 ? totalExpenses / daysElapsed : 0;

  // Calculate projected balance
  const projectedExpense = dailyAverage * daysRemaining;
  const projectedBalance = currentBalance - projectedExpense;

  return {
    currentBalance,
    projectedBalance,
    dailyAverage,
    daysRemaining
  };
}

export default {
  calculateForecast
};