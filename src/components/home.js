import { React, useEffect, useState, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import addUserData from "./firebase/addUserData";
import getUserData from "./firebase/getUserData";
import { getMonthlyTarget } from "./firebase/addMonthlyTarget";
import SettingsModal from "./SettingsModal"; // Import the SettingsModal component
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";
import { DollarSign, NotebookPen, History, CalendarDays, Save } from "lucide-react";
import Accordion from "react-bootstrap/Accordion";
import { formatMonth, ExpenseTable } from "./history";
import removeUserData from "./firebase/removeUserData";

function HomePageForm() {
  const [cash, setCash] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
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
      const data = Object.entries(JSON.parse(localStorage.getItem("data")));
      const currentMonth = new Date().toISOString().substring(0, 7);

      return data
        .filter(
          ([_, entry]) => !entry.isTarget && entry.date.startsWith(currentMonth)
        )
        .reduce((total, [_, entry]) => total + parseInt(entry.cash), 0);
    }
    return 0;
  };

  const getRemainingAmount = () => {
    const currentExpenses = getCurrentMonthExpenses();
    const target = parseInt(targetSpending) || 0;
    const remaining = target - currentExpenses;
    return remaining;
  };

  const errorMessage = () => (
    <div className="error" style={{ display: error ? "" : "none" }}>
      <h4>{t("pleaseEnterCash")}</h4>
    </div>
  );

  // Update current month data whenever form is submitted or component mounts
  useEffect(() => {
    if (localStorage.getItem("data")) {
      const data = Object.entries(JSON.parse(localStorage.getItem("data")))
        .sort((a, b) => parseInt(b[1].date.split("-").join("")) - parseInt(a[1].date.split("-").join("")));
      
      const currentMonth = new Date().toISOString().substring(0, 7);
      const currentMonthEntries = data
        .filter(([_, entry]) => !entry.isTarget && entry.date.startsWith(currentMonth))
        .map(([key, entry]) => ({ key, ...entry }));

      const total = currentMonthEntries.reduce((sum, entry) => sum + parseInt(entry.cash), 0);
      
      setCurrentMonthData({
        entries: currentMonthEntries,
        total: total
      });
    }
  }, [loading]); // Re-run when loading changes (i.e., after form submission)

  // Handle removal of an entry
  const handleRemove = async (entryId) => {
    const userId = localStorage.getItem("id");
    if (!userId || !entryId) {
      console.error("User ID or Entry ID is missing");
      return;
    }

    setLoadingId(entryId);
    try {
      // Remove the entry from Firebase
      await removeUserData(userId, entryId);

      // Update local state and localStorage
      if (localStorage.getItem("data")) {
        const data = JSON.parse(localStorage.getItem("data"));
        delete data[entryId];
        localStorage.setItem("data", JSON.stringify(data));
        
        // Update current month data
        const currentMonth = new Date().toISOString().substring(0, 7);
        const currentMonthEntries = Object.entries(data)
          .filter(([_, entry]) => !entry.isTarget && entry.date.startsWith(currentMonth))
          .map(([key, entry]) => ({ key, ...entry }));

        const total = currentMonthEntries.reduce((sum, entry) => sum + parseInt(entry.cash), 0);
        
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

  return (
    <div id="form-body" className="mb-5 container">
      <div className="d-flex justify-content-center align-content-center row mx-0">
        <div className="row align-items-around justify-content-center px-0 my-4 width-768">
          <div className="col h-100 px-1">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">{t("thisMonthExpenses")}</h5>
                <h2 className="card-text">${getCurrentMonthExpenses()}</h2>
                <div
                  className={`small ${
                    getRemainingAmount() >= 0 ? "text-success" : "text-danger"
                  } bg-light rounded-2 p-1 mt-2`}
                >
                  {getRemainingAmount() >= 0
                    ? t("remainingAmount")
                    : t("overAmount")}
                  : {Math.abs(getRemainingAmount())}
                </div>
              </div>
            </div>
          </div>
          <div className="col h-100 px-1">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">{t("monthlyTarget")}</h5>
                <h2 className="card-text">${targetSpending}</h2>
                <div className="progress bg-light">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${Math.min(
                        (getCurrentMonthExpenses() /
                          (parseInt(targetSpending) || 1)) *
                          100,
                        100
                      )}%`,
                      backgroundColor: (() => {
                        const percentage =
                          (getCurrentMonthExpenses() /
                            (parseInt(targetSpending) || 1)) *
                          100;
                        if (percentage <= 50) return "#28a745";
                        if (percentage <= 75) return "#ffc107";
                        if (percentage <= 90) return "#fd7e14";
                        return "#dc3545";
                      })(),
                    }}
                    aria-valuenow={getCurrentMonthExpenses()}
                    aria-valuemin="0"
                    aria-valuemax={parseInt(targetSpending) || 100}
                  ></div>
                </div>
                <div className="mt-2">
                  <small>
                    {getCurrentMonthExpenses() > (parseInt(targetSpending) || 0)
                      ? t("overBudget")
                      : `${Math.round(
                          (getCurrentMonthExpenses() /
                            (parseInt(targetSpending) || 1)) *
                            100
                        )}% ${t("ofTarget")}`}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-size bg-light shadow rounded-2">
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
        {/* Settings Modal */}
        <SettingsModal
          show={showSettings}
          handleClose={() => setShowSettings(false)}
          cashValues={cashValues}
          setCashValues={setCashValues}
          quickNotes={quickNotes}
          setQuickNotes={setQuickNotes}
          onTargetUpdate={(newTarget) => setTargetSpending(newTarget)}
        />
      </div>

      {/* Current Month Expenses Section */}
      <div className="mt-4 width-768">
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
