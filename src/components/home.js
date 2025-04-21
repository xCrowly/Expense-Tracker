import { React, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import addUserData from "./firebase/addUserData";
import getUserData from "./firebase/getUserData";
import { getMonthlyTarget } from "./firebase/addMonthlyTarget";
import SettingsModal from "./SettingsModal"; // Import the SettingsModal component

function HomePageForm() {
  const [cash, setCash] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [note, setNote] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [targetSpending, setTargetSpending] = useState("0");

  // Load saved values from localStorage
  const [cashValues, setCashValues] = useState([]);
  const [quickNotes, setQuickNotes] = useState([]);

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
      "Groceries",
      "Transport",
      "Entertainment",
      "Utilities",
      "Rent",
      "Shopping",
    ];
    setCashValues(savedCashValues);
    setQuickNotes(savedQuickNotes);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && window.location.pathname === "/home") {
      window.location.href = "/";
    }
  }, []);

  function getName () {
    const email = localStorage.getItem("email");
    return email ? email.split("@")[0] : "";
  };

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
        .filter(([_, entry]) => entry.date.startsWith(currentMonth))
        .reduce((total, [_, entry]) => total + parseInt(entry.cash), 0);
    }
    return 0;
  };

  const errorMessage = () => (
    <div className="error" style={{ display: error ? "" : "none" }}>
      <h4>Please enter cash</h4>
    </div>
  );

  return (
    <div id="form-body" className="mb-5">
      <div className="d-flex justify-content-center align-content-center row mx-0">
        <div className="row align-content-center justify-content-center w-auto text-white fs-4">
          <b>
            Welcome, <i>{getName()}</i>
          </b>
        </div>
        <div className="row align-items-around justify-content-center my-4">
          <div className="col h-100">
            <div className="card bg-success text-white h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">This Month's Expenses</h5>
                <h2 className="card-text">${getCurrentMonthExpenses()}</h2>
              </div>
            </div>
          </div>
          <div className="col h-100">
            <div className="card bg-primary text-white h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold">Monthly Target</h5>
                <h2 className="card-text">
                  ${targetSpending}
                </h2>
                <div className="progress bg-light">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${Math.min((getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100, 100)}%`,
                      backgroundColor: (() => {
                        const percentage = (getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100;
                        if (percentage <= 50) return '#28a745'; // green
                        if (percentage <= 75) return '#ffc107'; // yellow
                        if (percentage <= 90) return '#fd7e14'; // orange
                        return '#dc3545'; // red
                      })()
                    }}
                    aria-valuenow={getCurrentMonthExpenses()}
                    aria-valuemin="0"
                    aria-valuemax={parseInt(targetSpending) || 100}
                  ></div>
                </div>
                <small>
                  {getCurrentMonthExpenses() > (parseInt(targetSpending) || 0)
                    ? "Over budget!"
                    : `${Math.round((getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100)}% of target`}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-size bg-light shadow rounded-2">
        <Form onSubmit={handleSubmit}>
          <Form.Label className="fw-bold">Expenses</Form.Label>
          <div className="messages text-danger">{errorMessage()}</div>
          <InputGroup>
            <InputGroup.Text className="bg-success text-white">
              $
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
          <div className="mb-3">
            <p className="mb-2 fw-bold">Quick Cash:</p>
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
            Date:{" "}
          </label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            id="dateValue"
            name="date"
            className="m-3"
          />

          <InputGroup>
            <InputGroup.Text id="Note" className="bg-warning text-dark fw-bold">
              Note
            </InputGroup.Text>
            <Form.Control
              value={note}
              onChange={(e) => setNote(e.target.value)}
              id="noteValue"
            />
          </InputGroup>

          {/* Quick Notes Buttons */}
          <div className="mb-3">
            <p className="mb-2 fw-bold">Quick Notes:</p>
            <div className="d-flex flex-wrap d-flex flex-wrap justify-content-start gap-2">
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
          <div className=" d-flex justify-content-between align-items-center flex-shrink-1">
            <div className="row m-0">
              <Link
                to="/history"
                className="btn bg-success text-white button m-1 w-auto col"
              >
                History
              </Link>
              <Link
                to="/dashboard"
                className="btn bg-primary text-white button m-1 w-auto col"
              >
                Dashboard
              </Link>
            </div>
            <div className="row m-0">
              <Button
                variant="dark"
                onClick={() => setShowSettings(true)}
                className="m-1 w-auto col"
              >
                Settings
              </Button>
              <Button
                variant="danger"
                type="submit"
                className="m-1 text-white w-auto col"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
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
    </div>
  );
}

export default HomePageForm;
