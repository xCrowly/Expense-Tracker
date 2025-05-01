import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ExpenseVisualization from "./ExpenseVisualization";
import { getMonthlyTarget } from "./firebase/addMonthlyTarget";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

function Dashboard() {
  const [targetSpending, setTargetSpending] = useState("0");
  const { language } = useLanguage();
  
  const t = (key) => translations[language][key] || key;

  // Check if user is logged in and fetch target
  useEffect(() => {
    if (!localStorage.getItem("token") && window.location.pathname === "/dashboard") {
      window.location.href = "/";
    }

    // Fetch target spending
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
        setTargetSpending(localStorage.getItem("targetSpending") || "0");
      }
    };
    fetchTarget();
  }, []);

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    if (localStorage.getItem("data")) {
      const data = Object.entries(JSON.parse(localStorage.getItem("data")));
      return data
        .filter(([_, entry]) => !entry.isTarget)
        .reduce((total, [_, entry]) => total + parseInt(entry.cash), 0);
    }
    return 0;
  };

  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
    if (localStorage.getItem("data")) {
      const data = Object.entries(JSON.parse(localStorage.getItem("data")));
      const currentMonth = new Date().toISOString().substring(0, 7);

      return data
        .filter(([_, entry]) => !entry.isTarget && entry.date.startsWith(currentMonth))
        .reduce((total, [_, entry]) => total + parseInt(entry.cash), 0);
    }
    return 0;
  };

  return (
    <Container className="py-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 text-white">
        <h2>{t('dashboard')}</h2>
        <div>
          <Link
            to="/home"
            className="btn btn-primary m-2 d-flex flex-row-reverse"
          >
            {t('addExpense')}
          </Link>
          <Link
            to="/history"
            className="btn btn-success m-2 d-flex flex-column-reverse"
          >
            {t('history')}
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 d-flex">
          <div className="card bg-danger text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{t('totalExpenses')}</h5>
              <h2 className="card-text">${calculateTotalExpenses()}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex">
          <div className="card bg-success text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{t('thisMonthExpenses')}</h5>
              <h2 className="card-text">${getCurrentMonthExpenses()}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex">
          <div className="card bg-primary text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{t('monthlyTarget')}</h5>
              <h2 className="card-text">
                ${targetSpending}
              </h2>
              <div className="progress bg-light mt-auto">
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
              <small className="text-white mt-2">
                {getCurrentMonthExpenses() > (parseInt(targetSpending) || 0)
                  ? t('overBudget')
                  : `${Math.round((getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100)}% ${t('ofTarget')}`}
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
