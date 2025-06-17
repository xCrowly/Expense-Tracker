import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Form } from "react-bootstrap";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseVisualization = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [chartType, setChartType] = useState("bar");
  const [viewMode, setViewMode] = useState("monthly"); // 'monthly', 'category', 'trend', or 'income'
  const { language } = useLanguage();

  const t = (key) => translations[language][key] || key;

  // Function to load data from localStorage
  const loadData = useCallback(() => {
    // Load expense data
    if (localStorage.getItem("data")) {
      try {
        const userData = JSON.parse(localStorage.getItem("data"));
        // Make sure we're accessing the expenses property
        if (userData && userData.expenses) {
          const expensesData = userData.expenses;
          // Convert expenses object to array of entries with their keys
          const expensesOnly = Object.entries(expensesData)
            .filter(([_, entry]) => entry && entry.date && !entry.isTarget)
            .map(([key, entry]) => ({ id: key, ...entry }));
          setData(expensesOnly);
        }
      } catch (error) {
        console.error("Error loading visualization data:", error);
        setData([]);
      }
    }
    
    // Load income data
    if (localStorage.getItem("incomeData")) {
      try {
        const rawIncomeData = JSON.parse(localStorage.getItem("incomeData"));
        if (rawIncomeData) {
          const incomeEntries = Object.entries(rawIncomeData)
            .filter(([_, entry]) => entry && entry.date)
            .map(([key, entry]) => ({ id: key, ...entry }));
          setIncomeData(incomeEntries);
        }
      } catch (error) {
        console.error("Error loading income data:", error);
        setIncomeData([]);
      }
    }
  }, []);

  // Expose refresh method to parent components
  useImperativeHandle(ref, () => ({
    refreshData: loadData
  }));

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Process data for monthly visualization
  const processMonthlyData = () => {
    const monthlyData = {};

    data.forEach((entry) => {
      if (entry && entry.date && !entry.isTarget) {
        const month = entry.date.substr(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += parseInt(entry.cash) || 0;
      }
    });

    // Sort by month
    const sortedMonths = Object.keys(monthlyData).sort();

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: t("monthlyExpenses"),
          data: sortedMonths.map((month) => monthlyData[month]),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Process data for category visualization
  const processCategoryData = () => {
    const categoryData = {};
    let totalExpenses = 0;

    // First, calculate total expenses and individual category totals
    data.forEach((entry) => {
      if (entry && entry.cash && !entry.isTarget) {
        // Use category field if available, otherwise use note field, or fallback to "Uncategorized"
        const category = entry.category || entry.note || "Uncategorized";
        if (!categoryData[category]) {
          categoryData[category] = 0;
        }
        const amount = parseInt(entry.cash) || 0;
        categoryData[category] += amount;
        totalExpenses += amount;
      }
    });

    // Determine which categories are less than 1% of total
    const threshold = totalExpenses * 0.01;
    const mainCategories = {};
    let othersTotal = 0;

    // Separate main categories and small ones (less than 1%)
    Object.entries(categoryData).forEach(([category, amount]) => {
      if (amount >= threshold) {
        mainCategories[category] = amount;
      } else {
        othersTotal += amount;
      }
    });

    // Add "Others" category if there are any small categories
    if (othersTotal > 0) {
      mainCategories["Others"] = othersTotal;
    }

    const categories = Object.keys(mainCategories);

    // Generate random colors for each category
    const backgroundColors = categories.map((category) => {
      // Give "Others" category a consistent gray color if it exists
      if (category === "Others") {
        return "rgba(150, 150, 150, 0.6)";
      }
      return `rgba(${Math.floor(Math.random() * 200)}, ${Math.floor(
        Math.random() * 200
      )}, ${Math.floor(Math.random() * 200)}, 0.6)`;
    });

    return {
      labels: categories,
      datasets: [
        {
          label: t("expensesByCategory"),
          data: categories.map((category) => mainCategories[category]),
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((color) =>
            color.replace("0.6", "1")
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  // Process data for spending trends over time by category
  const processTrendData = () => {
    // First, determine all unique months and categories
    const months = new Set();
    const categories = new Set();

    data.forEach((entry) => {
      if (entry && entry.date && !entry.isTarget) {
        const month = entry.date.substr(0, 7);
        const category = entry.category || entry.note || "Uncategorized";
        months.add(month);
        categories.add(category);
      }
    });

    // Sort months chronologically
    const sortedMonths = Array.from(months).sort();

    // Create dataset for each category
    const datasets = Array.from(categories).map((category) => {
      // Generate random color for this category
      const r = Math.floor(Math.random() * 200);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(Math.random() * 200);

      // Prepare monthly data for this category
      const monthlyData = {};
      sortedMonths.forEach((month) => (monthlyData[month] = 0));

      // Sum expenses for each month in this category
      data.forEach((entry) => {
        if (entry && entry.date && !entry.isTarget && 
            ((entry.category || entry.note || "Uncategorized") === category)) {
          const month = entry.date.substr(0, 7);
          monthlyData[month] += parseInt(entry.cash) || 0;
        }
      });

      return {
        label: category,
        data: sortedMonths.map((month) => monthlyData[month]),
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
        borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
        borderWidth: 2,
        tension: 0.1,
      };
    });

    return {
      labels: sortedMonths,
      datasets: datasets,
    };
  };

  // Process data for monthly income visualization
  const processIncomeData = () => {
    const monthlyData = {};

    incomeData.forEach((entry) => {
      if (entry && entry.date) {
        const month = entry.date.substr(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += parseInt(entry.amount) || 0;
      }
    });

    // Sort by month
    const sortedMonths = Object.keys(monthlyData).sort();

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: t("monthlyIncomeVis"),
          data: sortedMonths.map((month) => monthlyData[month]),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  // Get current chart data based on viewMode
  const getChartData = () => {
    if (viewMode === "monthly") {
      return processMonthlyData();
    } else if (viewMode === "category") {
      return processCategoryData();
    } else if (viewMode === "trend") {
      return processTrendData();
    } else if (viewMode === "income") {
      return processIncomeData();
    }
    return { labels: [], datasets: [] };
  };

  // Render the appropriate chart based on selections
  const renderChart = () => {
    const chartData = getChartData();

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text:
            viewMode === "monthly"
              ? t("monthlyExpenses")
              : viewMode === "category"
              ? t("expensesByCategory")
              : viewMode === "income"
              ? t("monthlyIncomeVis")
              : t("categoryTrends"),
        },
      },
    };

    if (chartType === "bar") {
      return <Bar data={chartData} options={options} height={300} />;
    } else if (chartType === "pie" && viewMode === "category") {
      return <Pie data={chartData} options={options} height={300} />;
    } else if (chartType === "line" && viewMode === "trend") {
      return <Line data={chartData} options={options} height={300} />;
    } else {
      // Default to bar chart if current combination is not supported
      return <Bar data={chartData} options={options} height={300} />;
    }
  };

  return (
    <div className="visualization-container p-3 bg-light rounded-4 shadow mb-4">
      <h3 className="text-center mb-3">Expense Visualization</h3>

      <div className="mb-3">
        <Form>
          <div className="d-flex gap-3 mb-3">
            <Form.Group className="flex-grow-1">
              <Form.Label>View Mode</Form.Label>
              <Form.Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="monthly">{t("monthlyExpenses")}</option>
                <option value="category">{t("expensesByCategory")}</option>
                <option value="trend">{t("categoryTrends")}</option>
                <option value="income">{t("monthlyIncomeVis")}</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="flex-grow-1">
              <Form.Label>Chart Type</Form.Label>
              <Form.Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                disabled={viewMode === "trend" && chartType !== "line"}
              >
                <option value="bar">Bar Chart</option>
                {viewMode === "category" && (
                  <option value="pie">Pie Chart</option>
                )}
                {viewMode === "trend" && (
                  <option value="line">Line Chart</option>
                )}
              </Form.Select>
            </Form.Group>
          </div>
        </Form>
      </div>

      <div style={{ height: "400px" }}>
        {(viewMode === "income" ? incomeData.length > 0 : data.length > 0) ? (
          renderChart()
        ) : (
          <div className="text-center py-5 text-muted">
            <p>{viewMode === "income" ? t("noIncomeData") : t("noExpenseData")}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default ExpenseVisualization;
