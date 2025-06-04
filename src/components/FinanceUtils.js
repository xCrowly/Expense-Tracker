// Utility functions for financial calculations

// Get current month's expenses
export const getCurrentMonthExpenses = () => {
  if (localStorage.getItem("data")) {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));
      // Get expenses data from the nested structure
      const expensesData = userData.expenses || {};
      const data = Object.entries(expensesData);
      const currentMonth = new Date().toISOString().substring(0, 7);
      const startDate = new Date('2024-05-29'); // Only count expenses after this date

      return data
        .filter(([_, entry]) => {
          if (!entry || !entry.date || entry.isTarget) return false;
          const entryDate = new Date(entry.date);
          return entry.date.startsWith(currentMonth) && entryDate >= startDate;
        })
        .reduce((total, [_, entry]) => total + (parseInt(entry.cash) || 0), 0);
    } catch (error) {
      console.error("Error calculating current month expenses:", error);
      return 0;
    }
  }
  return 0;
};

// Get total income (all time)
export const getTotalIncome = () => {
  if (localStorage.getItem("data")) {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));
      const incomeData = userData.income || {};
      return Object.values(incomeData)
        .reduce((total, entry) => total + (parseInt(entry.amount) || 0), 0);
    } catch (error) {
      console.error("Error calculating total income:", error);
      return 0;
    }
  }
  return 0;
};

// Get total expenses (all time)
export const getTotalExpenses = () => {
  if (localStorage.getItem("data")) {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));
      const expensesData = userData.expenses || {};
      return Object.values(expensesData)
        .filter(entry => entry && !entry.isTarget)
        .reduce((total, entry) => total + (parseInt(entry.cash) || 0), 0);
    } catch (error) {
      console.error("Error calculating total expenses:", error);
      return 0;
    }
  }
  return 0;
};

// Get net balance
export const getNetBalance = () => {
  const totalIncome = getTotalIncome();
  
  // Get expenses excluding those before June 1, 2025
  if (localStorage.getItem("data")) {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));
      const expensesData = userData.expenses || {};
      const cutoffDate = new Date('2025-06-01');
      
      const filteredExpenses = Object.values(expensesData)
        .filter(entry => {
          if (!entry || entry.isTarget) return false;
          // Only include expenses on or after June 1, 2025
          const entryDate = new Date(entry.date);
          return entryDate >= cutoffDate;
        })
        .reduce((total, entry) => total + (parseInt(entry.cash) || 0), 0);
      
      return totalIncome - filteredExpenses;
    } catch (error) {
      console.error("Error calculating net balance with date filter:", error);
      return totalIncome;
    }
  }
  return totalIncome;
};

// Calculate balance percentage for progress bar
export const getBalancePercentage = () => {
  const totalIncome = getTotalIncome();
  return totalIncome > 0 ? (getNetBalance() / totalIncome) * 100 : 0;
};

// Calculate savings progress
export const getSavingsProgress = (savingsGoal) => {
  const savings = getNetBalance();
  const goal = parseInt(savingsGoal) || 0;
  return goal > 0 ? Math.min((savings / goal) * 100, 100) : 0;
};

// Check if expenses are too high compared to income
export const getExpenseWarning = (monthlyIncome, t) => {
  if (monthlyIncome <= 0) return null;
  const expenseRatio = (getCurrentMonthExpenses() / monthlyIncome) * 100;
  if (expenseRatio >= 80) {
    return t("warningExpensesHigh");
  }
  return null;
};

// Process current month's expense data
export const processCurrentMonthExpenses = () => {
  if (localStorage.getItem("data")) {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));
      // Get expenses data from the nested structure
      const expensesData = userData.expenses || {};
      
      const data = Object.entries(expensesData)
        .filter(([_, entry]) => entry && entry.date && !entry.isTarget)
        .sort((a, b) => b[1].date.localeCompare(a[1].date));
      
      const currentMonth = new Date().toISOString().substring(0, 7);
      const currentMonthEntries = data
        .filter(([_, entry]) => entry.date.startsWith(currentMonth))
        .map(([key, entry]) => ({ key, ...entry }));

      const total = currentMonthEntries.reduce((sum, entry) => sum + (parseInt(entry.cash) || 0), 0);
      
      return {
        entries: currentMonthEntries,
        total: total
      };
    } catch (error) {
      console.error("Error updating current month data:", error);
      return { entries: [], total: 0 };
    }
  }
  return { entries: [], total: 0 };
};

// Process current month's income data
export const processCurrentMonthIncome = () => {
  if (localStorage.getItem("data")) {
    try {
      const userData = JSON.parse(localStorage.getItem("data"));
      // Get income data from the nested structure
      const incomeData = userData.income || {};
      
      const data = Object.entries(incomeData)
        .filter(([_, entry]) => entry && entry.date)
        .sort((a, b) => b[1].date.localeCompare(a[1].date));
      
      const currentMonth = new Date().toISOString().substring(0, 7);
      const currentMonthEntries = data
        .filter(([_, entry]) => entry.date.startsWith(currentMonth))
        .map(([key, entry]) => ({ 
          key, 
          ...entry,
          amount: parseInt(entry.amount) || 0 // Ensure amount is parsed as integer
        }));

      const total = currentMonthEntries.reduce((sum, entry) => sum + entry.amount, 0);
      
      return {
        entries: currentMonthEntries,
        total: total
      };
    } catch (error) {
      console.error("Error updating current month income data:", error);
      return { entries: [], total: 0 };
    }
  }
  return { entries: [], total: 0 };
}; 