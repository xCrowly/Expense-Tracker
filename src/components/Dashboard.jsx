import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ExpenseVisualization from "./ExpenseVisualization";

function Dashboard() {
  // Check if user is logged in
  React.useEffect(() => {
    if (
      !localStorage.getItem("token") &&
      window.location.pathname === "/dashboard"
    ) {
      window.location.href = "/";
    }
  }, []);

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    if (localStorage.getItem("data")) {
      const data = Object.entries(JSON.parse(localStorage.getItem("data")));
      return data.reduce(
        (total, [_, entry]) => total + parseInt(entry.cash),
        0
      );
    }
    return 0;
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

  return (
    <Container className="py-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 text-white">
        <h2>Expense Dashboard</h2>
        <div>
          <Link
            to="/home"
            className="btn btn-primary m-2 d-flex flex-row-reverse"
          >
            Add Expense
          </Link>
          <Link
            to="/history"
            className="btn btn-success m-2 d-flex flex-column-reverse"
          >
            History
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 d-flex">
          <div className="card bg-danger text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Total Expenses</h5>
              <h2 className="card-text">${calculateTotalExpenses()}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex">
          <div className="card bg-success text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">This Month's Expenses</h5>
              <h2 className="card-text">${getCurrentMonthExpenses()}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex">
          <div className="card bg-primary text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Monthly Target</h5>
              <h2 className="card-text">
                ${localStorage.getItem("targetSpending") || "0"}
              </h2>
              <div className="progress bg-light mt-auto">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${Math.min((getCurrentMonthExpenses() / (localStorage.getItem("targetSpending") || 1)) * 100, 100)}%`,
                    backgroundColor: (() => {
                      const percentage = (getCurrentMonthExpenses() / (localStorage.getItem("targetSpending") || 1)) * 100;
                      if (percentage <= 50) return '#28a745'; // green
                      if (percentage <= 75) return '#ffc107'; // yellow
                      if (percentage <= 90) return '#fd7e14'; // orange
                      return '#dc3545'; // red
                    })()
                  }}
                  aria-valuenow={getCurrentMonthExpenses()}
                  aria-valuemin="0"
                  aria-valuemax={localStorage.getItem("targetSpending") || 100}
                ></div>
              </div>
              <small className="text-white mt-2">
                {getCurrentMonthExpenses() > (localStorage.getItem("targetSpending") || 0)
                  ? "Over budget!"
                  : `${Math.round((getCurrentMonthExpenses() / (localStorage.getItem("targetSpending") || 1)) * 100)}% of target`}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations */}
      <ExpenseVisualization />
    </Container>
  );
}

export default Dashboard;
