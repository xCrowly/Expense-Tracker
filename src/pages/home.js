import { React, useEffect, useState, useCallback } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import { DollarSign, Wallet, PiggyBank } from "lucide-react";
import addUserData from "../components/firebase/addUserData";
import getUserData from "../components/firebase/getUserData";
import addIncomeData from "../components/firebase/addIncomeData";
import getIncomeData from "../components/firebase/getIncomeData";
import { getMonthlyTarget } from "../components/firebase/addMonthlyTarget";
import removeUserData from "../components/firebase/removeUserData";
import removeIncomeData from "../components/firebase/removeIncomeData";
import { getSavingsGoal } from "../components/firebase/savingsGoal";

// Import new components
import DashboardCards from "../components/DashboardCards";
import AccordionSection from "../components/AccordionSection";
import ExpenseForm from "../components/ExpenseForm";
import IncomeForm from "../components/IncomeForm";
import SavingsForm from "../components/SavingsForm";

// Import utility functions
import {
  getCurrentMonthExpenses,
  getTotalIncome,
  getNetBalance,
  getBalancePercentage,
  getSavingsProgress,
  getExpenseWarning,
  processCurrentMonthExpenses,
  processCurrentMonthIncome,
} from "../components/FinanceUtils";

function HomePageForm() {
  const [cash, setCash] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [targetSpending, setTargetSpending] = useState("0");
  const [currentMonthData, setCurrentMonthData] = useState({
    entries: [],
    total: 0,
  });
  const { language } = useLanguage();

  // Load saved values from localStorage
  const [cashValues, setCashValues] = useState([]);
  const [quickNotes, setQuickNotes] = useState([]);

  const t = useCallback(
    (key) => translations[language][key] || key,
    [language]
  );

  // Fetch target spending on component mount
  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (userId) {
          const target = await getMonthlyTarget(userId);
          setTargetSpending(target);
          localStorage.setItem("targetSpending", target);
        }
      } catch (error) {
        console.error("Error fetching target:", error);
        // Fallback to localStorage
        setTargetSpending(localStorage.getItem("targetSpending") || "0");
      }
    };
    fetchTarget();
  }, []);

  useEffect(() => {
    const savedCashValues = JSON.parse(localStorage.getItem("cashValues")) || [
      1, 2, 5, 10, 20, 50,
    ];
    const savedQuickNotes = JSON.parse(localStorage.getItem("quickNotes")) || [
      t("groceries"),
      t("transport"),
      t("entertainment"),
      t("utilities"),
      t("rent"),
      t("shopping"),
    ];
    setCashValues(savedCashValues);
    setQuickNotes(savedQuickNotes);
  }, [language, t]); // Re-run when language changes

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && window.location.pathname === "/home") {
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cash || !date) {
      setError(true);
      return;
    }
    setLoading(true);
    try {
      await addUserData(
        localStorage.getItem("id"),
        Math.floor(cash),
        date,
        note
      );
      await getUserData(localStorage.getItem("id"));
    } catch (err) {
      console.error("Error submitting data:", err);
    } finally {
      setLoading(false);
      setCash("");
      setNote("");
    }
  };

  // Initialize netBalance with total values
  // eslint-disable-next-line no-unused-vars
  const [netBalance, setNetBalance] = useState(getNetBalance());

  // Update useEffect for net balance calculation - will update when data changes
  useEffect(() => {
    setNetBalance(getNetBalance());
  }, [loading]); // Update when loading changes (after adding/removing transactions)

  const errorMessage = () => (
    <div className="error" style={{ display: error ? "" : "none" }}>
      <h4>{t("pleaseEnterCash")}</h4>
    </div>
  );

  // Update current month data whenever form is submitted or component mounts
  useEffect(() => {
    const expenseData = processCurrentMonthExpenses();
    setCurrentMonthData(expenseData);
  }, [loading]); // Re-run when loading state changes

  // Handle removal of an entry
  const handleRemove = async (entryId) => {
    const userId = localStorage.getItem("id");
    if (!userId || !entryId) {
      console.error("Both userId and entryId are required");
      alert(t("failedToRemove"));
      return;
    }

    setLoadingId(entryId);
    try {
      // Remove the entry from Firebase
      await removeUserData(userId, entryId);

      // Update local state and localStorage
      if (localStorage.getItem("data")) {
        const userData = JSON.parse(localStorage.getItem("data"));
        const expensesData = { ...userData.expenses } || {};
        delete expensesData[entryId];

        // Update the expenses in the nested structure
        userData.expenses = expensesData;
        localStorage.setItem("data", JSON.stringify(userData));

        // Update current month data
        const updatedExpenseData = processCurrentMonthExpenses();
        setCurrentMonthData(updatedExpenseData);
      }
    } catch (error) {
      console.error("Error removing data:", error);
      alert(t("failedToRemove"));
    } finally {
      setLoadingId(null);
    }
  };

  // Add new state variables for income
  const [activeTab, setActiveTab] = useState("expenses");
  const [income, setIncome] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeNote, setIncomeNote] = useState("");
  const [incomeDate, setIncomeDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState("0");
  const [incomeSources] = useState([
    "Salary",
    "Freelance",
    "Investments",
    "Business",
    "Bonus",
    "Other",
  ]);

  // Add new useEffect for loading income data
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (userId) {
          // Get fresh data from Firebase
          const data = await getIncomeData(userId);
          
          // Make sure we're using the latest data from Firebase, not just localStorage
          if (data) {
            const currentMonth = new Date().toISOString().substring(0, 7);
            const monthlyTotal = Object.values(data)
              .filter((entry) => entry.date.startsWith(currentMonth))
              .reduce((sum, entry) => sum + parseInt(entry.amount), 0);
            setMonthlyIncome(monthlyTotal);
            
            // Also update the current month income data state
            const updatedIncomeData = processCurrentMonthIncome();
            setCurrentMonthIncomeData(updatedIncomeData);
          } else {
            // If no data from Firebase, reset the income values
            setMonthlyIncome(0);
            setCurrentMonthIncomeData({ entries: [], total: 0 });
          }
        }
      } catch (error) {
        console.error("Error fetching income data:", error);
        // Reset values on error
        setMonthlyIncome(0);
        setCurrentMonthIncomeData({ entries: [], total: 0 });
      }
    };
    fetchIncomeData();
  }, []);

  // Add useEffect to fetch savings goal
  useEffect(() => {
    const fetchSavingsGoal = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (userId) {
          const goal = await getSavingsGoal(userId);
          setSavingsGoal(goal.toString());
        }
      } catch (error) {
        console.error("Error fetching savings goal:", error);
      }
    };
    fetchSavingsGoal();
  }, []);

  // Add income submission handler
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    if (!income || !incomeDate || !incomeSource) {
      setError(true);
      return;
    }
    setLoading(true);
    try {
      // Add income data to Firebase
      await addIncomeData(
        localStorage.getItem("id"),
        Math.floor(income),
        incomeSource,
        incomeDate,
        incomeNote
      );

      // Update local storage with the new income data
      const userData = JSON.parse(localStorage.getItem("data") || "{}");
      if (!userData.income) {
        userData.income = {};
      }

      // Generate a unique key for the new income entry
      const newKey = Date.now().toString();
      userData.income[newKey] = {
        amount: Math.floor(income),
        source: incomeSource,
        date: incomeDate,
        note: incomeNote,
        timestamp: Date.now(),
      };

      // Update localStorage
      localStorage.setItem("data", JSON.stringify(userData));

      // Update current month income data
      const updatedIncomeData = processCurrentMonthIncome();
      setCurrentMonthIncomeData(updatedIncomeData);
      setMonthlyIncome(updatedIncomeData.total);
    } catch (err) {
      console.error("Error submitting income data:", err);
    } finally {
      setLoading(false);
      setIncome("");
      setIncomeNote("");
    }
  };

  // Add new state variables for income
  const [currentMonthIncomeData, setCurrentMonthIncomeData] = useState({
    entries: [],
    total: 0,
  });
  const [incomeLoadingId, setIncomeLoadingId] = useState(null);

  // Update income data processing
  useEffect(() => {
    const incomeData = processCurrentMonthIncome();
    setCurrentMonthIncomeData(incomeData);
    setMonthlyIncome(incomeData.total);
  }, [loading]); // Re-run when loading state changes

  // Add income removal handler
  const handleRemoveIncome = async (incomeId) => {
    const userId = localStorage.getItem("id");
    if (!userId || !incomeId) {
      console.error("User ID or Income ID is missing");
      return;
    }

    setIncomeLoadingId(incomeId);
    try {
      // Remove from Firebase
      await removeIncomeData(userId, incomeId);

      // Fetch fresh data from Firebase to ensure we have the latest state
      const freshData = await getIncomeData(userId);
      
      // Update local state with the fresh data from Firebase
      const updatedIncomeData = processCurrentMonthIncome();
      setCurrentMonthIncomeData(updatedIncomeData);
      
      // Calculate the new monthly income from the fresh data
      const currentMonth = new Date().toISOString().substring(0, 7);
      const monthlyTotal = freshData ? 
        Object.values(freshData)
          .filter(entry => entry && entry.date && entry.date.startsWith(currentMonth))
          .reduce((sum, entry) => sum + parseInt(entry.amount), 0) 
        : 0;
      
      setMonthlyIncome(monthlyTotal);
    } catch (error) {
      console.error("Error removing income data:", error);
      alert(t("failedToRemove"));
    } finally {
      setIncomeLoadingId(null);
    }
  };

  // Wrapper functions to pass to components
  const getExpenseWarningWrapper = () => getExpenseWarning(monthlyIncome, t);
  const getSavingsProgressWrapper = () => getSavingsProgress(savingsGoal);

  return (
    <div id="form-body" className="container py-4">
      <div className="row">
        {/* Cards Section - Always first on mobile, right column on desktop */}
        <div className="col-12 col-lg-6 order-1 order-lg-2">
          {/* Cards Grid */}
          <DashboardCards
            t={t}
            monthlyIncome={monthlyIncome}
            getCurrentMonthExpenses={getCurrentMonthExpenses}
            targetSpending={targetSpending}
            getNetBalance={getNetBalance}
            getBalancePercentage={getBalancePercentage}
            getTotalIncome={getTotalIncome}
            getExpenseWarning={getExpenseWarningWrapper}
          />

          {/* Accordions - Only visible on desktop */}
          <div className="d-none d-lg-block">
            {/* Expenses Accordion */}
            <AccordionSection
              type="expenses"
              t={t}
              language={language}
              data={currentMonthData}
              showDelete={true}
              onDelete={handleRemove}
              loadingId={loadingId}
            />
            {/* Income Accordion */}
            <AccordionSection
              type="income"
              t={t}
              language={language}
              data={currentMonthIncomeData}
              showDelete={true}
              onDelete={handleRemoveIncome}
              loadingId={incomeLoadingId}
            />
          </div>
        </div>

        {/* Form Section - Second on mobile, left column on desktop */}
        <div className="col-12 col-lg-6 order-2 order-lg-1 mb-4">
          <div className="form-size bg-light shadow rounded-2">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              <Tab
                eventKey="expenses"
                title={
                  <span>
                    <DollarSign size={18} className="me-1" />
                    {t("expenses")}
                  </span>
                }
              >
                <ExpenseForm
                  t={t}
                  cash={cash}
                  setCash={setCash}
                  date={date}
                  setDate={setDate}
                  note={note}
                  setNote={setNote}
                  errorMessage={errorMessage}
                  loading={loading}
                  handleSubmit={handleSubmit}
                  cashValues={cashValues}
                  quickNotes={quickNotes}
                />
              </Tab>
              <Tab
                eventKey="income"
                title={
                  <span>
                    <Wallet size={18} className="me-1" />
                    {t("income")}
                  </span>
                }
              >
                <IncomeForm
                  t={t}
                  income={income}
                  setIncome={setIncome}
                  incomeSource={incomeSource}
                  setIncomeSource={setIncomeSource}
                  incomeDate={incomeDate}
                  setIncomeDate={setIncomeDate}
                  incomeNote={incomeNote}
                  setIncomeNote={setIncomeNote}
                  errorMessage={errorMessage}
                  loading={loading}
                  handleIncomeSubmit={handleIncomeSubmit}
                  incomeSources={incomeSources}
                />
              </Tab>
              <Tab
                eventKey="savings"
                title={
                  <span>
                    <PiggyBank size={18} className="me-1" />
                    {t("savings")}
                  </span>
                }
              >
                <SavingsForm
                  t={t}
                  savingsGoal={savingsGoal}
                  setSavingsGoal={setSavingsGoal}
                  getSavingsProgress={getSavingsProgressWrapper}
                  getNetBalance={getNetBalance}
                />
              </Tab>
            </Tabs>
          </div>
        </div>

        {/* Accordions - Only visible on mobile, below form */}
        <div className="col-12 d-lg-none order-3">
          {/* Expenses Accordion */}
          <AccordionSection
            type="expenses"
            t={t}
            language={language}
            data={currentMonthData}
            showDelete={true}
            onDelete={handleRemove}
            loadingId={loadingId}
          />

          {/* Income Accordion */}
          <AccordionSection
            type="income"
            t={t}
            language={language}
            data={currentMonthIncomeData}
            showDelete={true}
            onDelete={handleRemoveIncome}
            loadingId={incomeLoadingId}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePageForm;
