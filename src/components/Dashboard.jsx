import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ExpenseVisualization from "./ExpenseVisualization";
import { getMonthlyTarget } from "./firebase/addMonthlyTarget";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";
import getIncomeData from "./firebase/getIncomeData";

function Dashboard() {
  const [targetSpending, setTargetSpending] = useState("0");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
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

    // Fetch income data
    const fetchIncomeData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (userId) {
          const data = await getIncomeData(userId);
          if (data) {
            const currentMonth = new Date().toISOString().substring(0, 7);
            const startDate = new Date('2024-05-29');
            const monthlyTotal = Object.values(data)
              .filter(entry => {
                if (!entry || !entry.date) return false;
                const entryDate = new Date(entry.date);
                return entry.date.startsWith(currentMonth) && entryDate >= startDate;
              })
              .reduce((sum, entry) => sum + parseInt(entry.amount), 0);
            setMonthlyIncome(monthlyTotal);
          }
        }
      } catch (error) {
        console.error("Error fetching income data:", error);
        setMonthlyIncome(0);
      }
    };
    fetchIncomeData();
  }, []);


  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
    if (localStorage.getItem("data")) {
      try {
        const userData = JSON.parse(localStorage.getItem("data"));
        const expensesData = userData.expenses || {};
        const data = Object.entries(expensesData);
        const currentMonth = new Date().toISOString().substring(0, 7);
        const startDate = new Date('2024-05-29');

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

  // Calculate net balance
  const getNetBalance = () => {
    const expenses = getCurrentMonthExpenses();
    return monthlyIncome - expenses;
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
        <div className="col-md-3 d-flex">
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
              <small className="text-white mt-2">
                {getCurrentMonthExpenses() > (parseInt(targetSpending) || 0)
                  ? t('overBudget')
                  : `${Math.round((getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) * 100)}% ${t('ofTarget')}`}
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3 d-flex">
          <div className="card bg-success text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{t('thisMonthExpenses')}</h5>
              <h2 className="card-text">${getCurrentMonthExpenses()}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 d-flex">
          <div className="card bg-info text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{t('monthlyIncome')}</h5>
              <h2 className="card-text">${monthlyIncome}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 d-flex">
          <div className="card bg-warning text-white w-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{t('netBalance')}</h5>
              <h2 className="card-text">${getNetBalance()}</h2>
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
