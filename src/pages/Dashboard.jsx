import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ExpenseVisualization from "../components/ExpenseVisualization";
import { getMonthlyTarget } from "../components/firebase/addMonthlyTarget";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import getIncomeData from "../components/firebase/getIncomeData";
import getUserData from "../components/firebase/getUserData";

function Dashboard() {
  const [targetSpending, setTargetSpending] = useState("0");
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const { language } = useLanguage();
  const visualizationRef = useRef(null);

  const t = (key) => translations[language][key] || key;

  // Check if user is logged in and fetch target
  useEffect(() => {
    if (
      !localStorage.getItem("token") &&
      window.location.pathname === "/dashboard"
    ) {
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
            // Store raw income data in localStorage for visualization component
            localStorage.setItem("incomeData", JSON.stringify(data));
            
            // Calculate total income (all time)
            const allTimeTotal = Object.values(data).reduce(
              (sum, entry) => sum + parseInt(entry.amount),
              0
            );
            setTotalIncome(allTimeTotal);

            // Calculate current month income
            const currentMonth = new Date().toISOString().substring(0, 7);
            const startDate = new Date("2024-05-29");
            const monthlyTotal = Object.values(data)
              .filter((entry) => {
                if (!entry || !entry.date) return false;
                const entryDate = new Date(entry.date);
                return (
                  entry.date.startsWith(currentMonth) && entryDate >= startDate
                );
              })
              .reduce((sum, entry) => sum + parseInt(entry.amount), 0);
            setMonthlyIncome(monthlyTotal);
          }
        }
      } catch (error) {
        console.error("Error fetching income data:", error);
        setMonthlyIncome(0);
        setTotalIncome(0);
      }
    };
    fetchIncomeData();

    // Fetch expense data
    const fetchExpenseData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (userId) {
          await getUserData(userId);
          calculateTotalExpenses();

          // Refresh visualization data
          if (visualizationRef.current) {
            visualizationRef.current.refreshData();
          }
        }
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };
    fetchExpenseData();
  }, []);

  // Calculate total expenses (all time)
  const calculateTotalExpenses = () => {
    if (localStorage.getItem("data")) {
      try {
        const userData = JSON.parse(localStorage.getItem("data"));
        const expensesData = userData.expenses || {};
        const total = Object.values(expensesData)
          .filter((entry) => !entry.isTarget)
          .reduce((sum, entry) => sum + (parseInt(entry.cash) || 0), 0);
        setTotalExpenses(total);
      } catch (error) {
        console.error("Error calculating total expenses:", error);
        setTotalExpenses(0);
      }
    }
  };

  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
    if (localStorage.getItem("data")) {
      try {
        const userData = JSON.parse(localStorage.getItem("data"));
        const expensesData = userData.expenses || {};
        const data = Object.entries(expensesData);
        const currentMonth = new Date().toISOString().substring(0, 7);
        const startDate = new Date("2024-05-29");

        return data
          .filter(([_, entry]) => {
            if (!entry || !entry.date || entry.isTarget) return false;
            const entryDate = new Date(entry.date);
            return (
              entry.date.startsWith(currentMonth) && entryDate >= startDate
            );
          })
          .reduce(
            (total, [_, entry]) => total + (parseInt(entry.cash) || 0),
            0
          );
      } catch (error) {
        console.error("Error calculating current month expenses:", error);
        return 0;
      }
    }
    return 0;
  };


  return (
    <Container className="py-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 text-white">
        <h2>{t("dashboard")}</h2>
        <div>
          <Link
            to="/home"
            className="btn btn-primary m-2 d-flex flex-row-reverse"
          >
            {t("addExpense")}
          </Link>
          <Link
            to="/history"
            className="btn btn-success m-2 d-flex flex-column-reverse"
          >
            {t("history")}
          </Link>
        </div>
      </div>

      {/* Summary Cards - Updated to match home.js design */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title fw-bold mb-0">
                  {t("thisMonthExpenses")}
                </h6>
                <h4 className="card-text mb-0">${getCurrentMonthExpenses()}</h4>
              </div>
              <div className="progress bg-light mt-1" style={{ height: "6px" }}>
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
              <small className="mt-1 d-block" style={{ fontSize: "0.7rem" }}>
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
        <div className="col-6 col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title fw-bold mb-0">
                  {t("monthlyIncome")}
                </h6>
                <h4 className="card-text mb-0">${monthlyIncome}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title fw-bold mb-0">
                  {t("totalExpenses")}
                </h6>
                <h4 className="card-text mb-0">${totalExpenses}</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body py-2">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="card-title fw-bold mb-0">{t("totalIncome")}</h6>
                <h4 className="card-text mb-0">${totalIncome}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations */}
      <ExpenseVisualization ref={visualizationRef} />
    </Container>
  );
}

export default Dashboard;
