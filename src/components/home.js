import { React, useEffect, useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import addUserData from "./firebase/addUserData";
import getUserData from "./firebase/getUserData";
import addIncomeData from "./firebase/addIncomeData";
import getIncomeData from "./firebase/getIncomeData";
import { getMonthlyTarget } from "./firebase/addMonthlyTarget";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";
import { DollarSign, NotebookPen, History, CalendarDays, Save, Wallet, PiggyBank } from "lucide-react";
import Accordion from "react-bootstrap/Accordion";
import { formatMonth, ExpenseTable } from "./history";
import removeUserData from "./firebase/removeUserData";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ProgressBar from "react-bootstrap/ProgressBar";
import { IncomeTable } from "./IncomeTable";
import removeIncomeData from "./firebase/removeIncomeData";

function HomePageForm() {
  const [cash, setCash] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [targetSpending, setTargetSpending] = useState("0");
  const [currentMonthData, setCurrentMonthData] = useState({ entries: [], total: 0 });
  const { language } = useLanguage();

  // Load saved values from localStorage
  const [cashValues, setCashValues] = useState([]);
  const [quickNotes, setQuickNotes] = useState([]);

  // const t = (key) => translations[language][key] || key;
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

  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
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
  const getTotalIncome = () => {
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
  const getTotalExpenses = () => {
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

  // Initialize netBalance with total values
  // eslint-disable-next-line no-unused-vars
  const [netBalance, setNetBalance] = useState(getTotalIncome() - getTotalExpenses());

  // Update net balance calculation
  const getNetBalance = () => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    return totalIncome - totalExpenses;
  };


  // Update useEffect for net balance calculation - will update when data changes
  useEffect(() => {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    setNetBalance(totalIncome - totalExpenses);
  }, [loading]); // Update when loading changes (after adding/removing transactions)

  // Update the progress bar calculation in the net balance card
  const getBalancePercentage = () => {
    const totalIncome = getTotalIncome();
    return totalIncome > 0 ? (getNetBalance() / totalIncome) * 100 : 0;
  };

  const errorMessage = () => (
    <div className="error" style={{ display: error ? "" : "none" }}>
      <h4>{t("pleaseEnterCash")}</h4>
    </div>
  );

  // Update current month data whenever form is submitted or component mounts
  useEffect(() => {
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
        
        setCurrentMonthData({
          entries: currentMonthEntries,
          total: total
        });
      } catch (error) {
        console.error("Error updating current month data:", error);
        setCurrentMonthData({ entries: [], total: 0 });
      }
    }
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
        const currentMonth = new Date().toISOString().substring(0, 7);
        const currentMonthEntries = Object.entries(expensesData)
          .filter(([_, entry]) => entry && !entry.isTarget && entry.date && entry.date.startsWith(currentMonth))
          .map(([key, entry]) => ({ key, ...entry }));

        const total = currentMonthEntries.reduce((sum, entry) => sum + (parseInt(entry.cash) || 0), 0);
        
        setCurrentMonthData({
          entries: currentMonthEntries,
          total: total
        });
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
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().substring(0, 10));
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(localStorage.getItem("savingsGoal") || "0");
  const [incomeSources] = useState([
    "Salary",
    "Freelance",
    "Investments",
    "Business",
    "Bonus",
    "Other"
  ]);

  // Add new useEffect for loading income data
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (userId) {
          const data = await getIncomeData(userId);
          if (data) {
            const currentMonth = new Date().toISOString().substring(0, 7);
            const monthlyTotal = Object.values(data)
              .filter(entry => entry.date.startsWith(currentMonth))
              .reduce((sum, entry) => sum + parseInt(entry.amount), 0);
            setMonthlyIncome(monthlyTotal);
          }
        }
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };
    fetchIncomeData();
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
        timestamp: Date.now()
      };

      // Update localStorage
      localStorage.setItem("data", JSON.stringify(userData));

      // Update current month income data
      const currentMonth = new Date().toISOString().substring(0, 7);
      const currentMonthEntries = Object.entries(userData.income)
        .filter(([_, entry]) => entry.date.startsWith(currentMonth))
        .map(([key, entry]) => ({
          key,
          ...entry,
          amount: parseInt(entry.amount) || 0
        }));

      const total = currentMonthEntries.reduce((sum, entry) => sum + entry.amount, 0);

      setCurrentMonthIncomeData({
        entries: currentMonthEntries,
        total: total
      });
      setMonthlyIncome(total);

    } catch (err) {
      console.error("Error submitting income data:", err);
    } finally {
      setLoading(false);
      setIncome("");
      setIncomeNote("");
    }
  };

  // Calculate net balance and savings progress
  const getSavingsProgress = () => {
    const savings = getNetBalance();
    const goal = parseInt(savingsGoal) || 0;
    return goal > 0 ? Math.min((savings / goal) * 100, 100) : 0;
  };

  // Add warning threshold check
  const getExpenseWarning = () => {
    if (monthlyIncome <= 0) return null;
    const expenseRatio = (getCurrentMonthExpenses() / monthlyIncome) * 100;
    if (expenseRatio >= 80) {
      return t("warningExpensesHigh");
    }
    return null;
  };

  // Add new state variables for income
  const [currentMonthIncomeData, setCurrentMonthIncomeData] = useState({ entries: [], total: 0 });
  const [incomeLoadingId, setIncomeLoadingId] = useState(null);

  // Update income data processing
  useEffect(() => {
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
        
        setCurrentMonthIncomeData({
          entries: currentMonthEntries,
          total: total
        });
        setMonthlyIncome(total); // Update monthly income state
      } catch (error) {
        console.error("Error updating current month income data:", error);
        setCurrentMonthIncomeData({ entries: [], total: 0 });
        setMonthlyIncome(0);
      }
    }
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

      // Update localStorage
      const userData = JSON.parse(localStorage.getItem("data") || "{}");
      if (userData.income && userData.income[incomeId]) {
        delete userData.income[incomeId];
        localStorage.setItem("data", JSON.stringify(userData));

        // Update current month income data
        const currentMonth = new Date().toISOString().substring(0, 7);
        const currentMonthEntries = Object.entries(userData.income || {})
          .filter(([_, entry]) => entry && entry.date && entry.date.startsWith(currentMonth))
          .map(([key, entry]) => ({
            key,
            ...entry,
            amount: parseInt(entry.amount) || 0
          }));

        const total = currentMonthEntries.reduce((sum, entry) => sum + entry.amount, 0);

        // Update all income-related states
        setCurrentMonthIncomeData({
          entries: currentMonthEntries,
          total: total
        });
        setMonthlyIncome(total);
      }
    } catch (error) {
      console.error("Error removing income data:", error);
      alert(t("failedToRemove"));
    } finally {
      setIncomeLoadingId(null);
    }
  };

  return (
    <div id="form-body" className="mb-5 container">
      <div className="d-flex card-size justify-content-center align-content-center row">
        <div className="row align-items-around justify-content-center px-0 my-1">
          <div className="col-md-6 mb-3">
            <div className="card bg-primary text-white h-100">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="card-title fw-bold mb-0">{t("monthlyIncome")}</h6>
                  <h4 className="card-text mb-0">${monthlyIncome}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card bg-danger text-white h-100">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="card-title fw-bold mb-0">{t("thisMonthExpenses")}</h6>
                  <h4 className="card-text mb-0">${getCurrentMonthExpenses()}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card bg-warning text-white h-100">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="card-title fw-bold mb-0">{t("monthlyTarget")}</h6>
                  <h4 className="card-text mb-0">${targetSpending}</h4>
                </div>
                <div className="progress bg-light mt-1" style={{ height: '6px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${Math.min((getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100, 100)}%`,
                      backgroundColor: (() => {
                        const percentage = (getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100;
                        if (percentage <= 50) return '#28a745';
                        if (percentage <= 75) return '#ffc107';
                        if (percentage <= 90) return '#fd7e14';
                        return '#dc3545';
                      })()
                    }}
                    aria-valuenow={getCurrentMonthExpenses()}
                    aria-valuemin="0"
                    aria-valuemax={parseInt(targetSpending) || 100}
                  ></div>
                </div>
                <small className="mt-1 d-block" style={{ fontSize: '0.7rem' }}>
                  {Math.round((getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100)}% {t("used")}
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card bg-success text-white h-100">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="card-title fw-bold mb-0">{t("netBalance")}</h6>
                  <h4 className="card-text mb-0">${getNetBalance()}</h4>
                </div>
                <div className="progress bg-light mt-1" style={{ height: '6px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${Math.min(getBalancePercentage(), 100)}%`,
                      backgroundColor: (() => {
                        const percentage = getBalancePercentage();
                        if (percentage >= 75) return '#28a745';
                        if (percentage >= 50) return '#ffc107';
                        if (percentage >= 25) return '#fd7e14';
                        return '#dc3545';
                      })()
                    }}
                    aria-valuenow={getNetBalance()}
                    aria-valuemin="0"
                    aria-valuemax={getTotalIncome()}
                  ></div>
                </div>
                <small className="mt-1 d-block" style={{ fontSize: '0.7rem' }}>
                  {Math.round(getBalancePercentage())}% {t("remaining")} {t("ofTotalIncome")}
                </small>
                {getExpenseWarning() && (
                  <div className="alert alert-warning p-1 mt-1 mb-0" style={{ fontSize: '0.7rem' }}>
                    {getExpenseWarning()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-size bg-light shadow rounded-2">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="expenses" title={<span><DollarSign size={18} className="me-1" />{t("expenses")}</span>}>
            <Form onSubmit={handleSubmit}>
              <Form.Label className="fw-bold">{t("expenses")}:</Form.Label>
              <div className="messages text-danger">{errorMessage()}</div>
              <InputGroup>
                <InputGroup.Text className="bg-success text-white">
                  <DollarSign size={18} />
                </InputGroup.Text>
                <Form.Control
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  type="number"
                  min="1"
                  step="1"
                  id="cashValue"
                />
              </InputGroup>

              {/* Cash Buttons */}
              <div className="my-1">
                <p className="mb-2 fw-bold">{t("quickCash")}:</p>
                <div className="d-flex flex-wrap justify-content-start gap-2">
                  {cashValues.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline-secondary"
                      onClick={() => setCash(amount)}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              <label htmlFor="date" className="ms-3 fw-bold">
                <CalendarDays className="me-2" size={28} />
                {t("date")}:{" "}
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                id="dateValue"
                name="date"
                className="m-3 p-1 w-max rounded-2 border-0 shadow-sm"
              />

              <InputGroup>
                <InputGroup.Text id="Note" className="bg-warning text-dark fw-bold">
                  <NotebookPen className="me-2" size={18} />
                  {t("note")}
                </InputGroup.Text>
                <Form.Control
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  id="noteValue"
                />
              </InputGroup>

              {/* Quick Notes Buttons */}
              <div className="my-1">
                <p className="mb-2 fw-bold">{t("quickNotes")}:</p>
                <div className="d-flex flex-wrap justify-content-start gap-2">
                  {quickNotes.map((text) => (
                    <Button
                      key={text}
                      variant="outline-primary"
                      onClick={() => setNote(text)}
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              </div>

              <br />
              <div className="d-flex justify-content-between align-items-center flex-shrink-1 ">
                {/* <div className="row m-0">
                  <Link
                    to="/dashboard"
                    className="btn bg-primary text-white button m-1 w-auto col"
                    >
                    {t("dashboard")}
                    </Link>
                  <Link
                    to="/settings"
                    className="btn bg-secondary text-white m-1 w-auto col"
                  >
                    {t("settings")}
                  </Link>
                </div> */}

                <Link
                  to="/history"
                  className="btn bg-success text-white button m-1 w-auto col"
                >
                  <History className="me-2" size={22} />
                  {t("history")}
                </Link>
                <Button
                  variant="danger"
                  type="submit"
                  className="m-1 text-white w-auto col"
                  disabled={loading}
                >
                  <Save className="me-2" size={22} />
                  {loading ? t("submitting") : t("submit")}
                </Button>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="income" title={<span><Wallet size={18} className="me-1" />{t("income")}</span>}>
            <Form onSubmit={handleIncomeSubmit}>
              <Form.Label className="fw-bold">{t("income")}:</Form.Label>
              <div className="messages text-danger">{errorMessage()}</div>
              <InputGroup>
                <InputGroup.Text className="bg-primary text-white">
                  <DollarSign size={18} />
                </InputGroup.Text>
                <Form.Control
                  value={income}
                  onChange={(e) => {
                    const value = Math.floor(Number(e.target.value));
                    if (value >= 1 || e.target.value === '') {
                      setIncome(e.target.value === '' ? '' : value);
                    }
                  }}
                  type="number"
                  min="1"
                  step="1"
                  onKeyDown={(e) => {
                    if (e.key === '.' || e.key === '-' || e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                  id="incomeValue"
                />
              </InputGroup>

              <Form.Group className="my-3">
                <Form.Label className="fw-bold">{t("source")}:</Form.Label>
                <Form.Select
                  value={incomeSource}
                  onChange={(e) => setIncomeSource(e.target.value)}
                >
                  <option value="">{t("selectSource")}</option>
                  {incomeSources.map((source) => (
                    <option key={source} value={source}>
                      {t(source.toLowerCase())}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <label htmlFor="incomeDate" className="ms-3 fw-bold">
                <CalendarDays className="me-2" size={28} />
                {t("date")}:{" "}
              </label>
              <input
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                type="date"
                id="incomeDateValue"
                name="incomeDate"
                className="m-3 p-1 w-max rounded-2 border-0 shadow-sm"
              />

              <InputGroup>
                <InputGroup.Text className="bg-warning text-dark fw-bold">
                  <NotebookPen className="me-2" size={18} />
                  {t("note")}
                </InputGroup.Text>
                <Form.Control
                  value={incomeNote}
                  onChange={(e) => setIncomeNote(e.target.value)}
                  id="incomeNoteValue"
                />
              </InputGroup>

              <div className="d-flex justify-content-end mt-3">
                <Link
                  to="/income-history"
                  className="btn bg-success text-white button m-1 w-auto col"
                >
                  <History className="me-2" size={22} />
                  {t("incomeHistory")}
                </Link>
                <Button
                  variant="primary"
                  type="submit"
                  className="btn bg-primary text-white button m-1 w-auto col"
                  disabled={loading}
                >
                  <Save className="me-2" size={22} />
                  {loading ? t("submitting") : t("submit")}
                </Button>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="savings" title={<span><PiggyBank size={18} className="me-1" />{t("savings")}</span>}>
            <div className="p-3">
              <h5 className="fw-bold mb-3">{t("savingsGoal")}</h5>
              <InputGroup className="mb-3">
                <InputGroup.Text className="bg-success text-white">
                  <DollarSign size={18} />
                </InputGroup.Text>
                <Form.Control
                  value={savingsGoal}
                  onChange={(e) => {
                    setSavingsGoal(e.target.value);
                    localStorage.setItem("savingsGoal", e.target.value);
                  }}
                  type="number"
                  min="0"
                  step="100"
                  placeholder={t("enterSavingsGoal")}
                />
              </InputGroup>

              <div className="mt-4">
                <h6 className="fw-bold">{t("savingsProgress")}</h6>
                <ProgressBar
                  now={getSavingsProgress()}
                  label={`${Math.round(getSavingsProgress())}%`}
                  variant={getSavingsProgress() >= 100 ? "success" : "primary"}
                  className="mt-2"
                />
                <small className="text-muted mt-2 d-block">
                  {t("currentSavings")}: ${getNetBalance()} / ${savingsGoal}
                </small>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Current Month Income Section */}
      <div className="mt-4 width-768">
        <div className="mb-3">
          <h5 className="text-white fw-bold">{t("income")}</h5>
        </div>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 fw-bold">
                <span>{formatMonth(new Date().toISOString().substring(0, 7), language)}</span>
                <span className="text-primary fw-bold mx-2">
                  {t("total")}: ${currentMonthIncomeData.total}
                </span>
              </div>
            </Accordion.Header>
            <Accordion.Body className="acc-body">
              <IncomeTable 
                entries={currentMonthIncomeData.entries} 
                total={currentMonthIncomeData.total} 
                t={t}
                showDelete={true}
                onDelete={(key) => handleRemoveIncome(key)}
                loadingId={incomeLoadingId}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Current Month Expenses Section */}
      <div className="mt-4 width-768">
        <div className="mb-3">
          <h5 className="text-white fw-bold">{t("expenses")}</h5>
        </div>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 fw-bold">
                <span>{formatMonth(new Date().toISOString().substring(0, 7), language)}</span>
                <span className="text-success fw-bold mx-2">
                  {t("total")}: ${currentMonthData.total}
                </span>
              </div>
            </Accordion.Header>
            <Accordion.Body className="acc-body">
              <ExpenseTable 
                entries={currentMonthData.entries} 
                total={currentMonthData.total} 
                t={t}
                showDelete={true}
                onDelete={(key) => handleRemove(key)}
                loadingId={loadingId}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default HomePageForm;
