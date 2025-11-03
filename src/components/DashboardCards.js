import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCards = ({
  t,
  monthlyIncome,
  getCurrentMonthExpenses,
  targetSpending,
  getNetBalance,
  getBalancePercentage,
  getTotalIncome,
  getExpenseWarning,
}) => {
  const navigate = useNavigate();
  return (
    <div className="row g-3 mb-4">
      <div className="col-6">
        <div
          className="card bg-dark text-white h-100"
          onClick={() => navigate("/income-history")}
          style={{ cursor: "pointer" }}
        >
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-title mb-0">{t("monthlyIncome")}</h6>
              <h6 className="card-text mb-0">${monthlyIncome}</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div
          className="card bg-dark text-white h-100"
          onClick={() => navigate("/history")}
          style={{ cursor: "pointer" }}
        >
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-title mb-0">
                {t("thisMonthExpenses")}
              </h6>
              <h6 className="card-text mb-0">${getCurrentMonthExpenses()}</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div
          className="card bg-dark text-white h-100"
          onClick={() => navigate("/settings")}
          style={{ cursor: "pointer" }}
        >
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-title mb-0">{t("monthlyTarget")}</h6>
              <h6 className="card-text mb-0">${targetSpending}</h6>
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
              {Math.round(
                (getCurrentMonthExpenses() / (parseInt(targetSpending) || 1)) *
                  100
              )}
              % {t("used")}
            </small>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div
          className="card bg-dark text-white h-100"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-title mb-0">{t("netBalance")}</h6>
              <h6 className="card-text mb-0">${getNetBalance()}</h6>
            </div>
            <div className="progress bg-light mt-1" style={{ height: "6px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${Math.min(getBalancePercentage(), 100)}%`,
                  backgroundColor: (() => {
                    const percentage = getBalancePercentage();
                    if (percentage >= 75) return "#28a745";
                    if (percentage >= 50) return "#ffc107";
                    if (percentage >= 25) return "#fd7e14";
                    return "#dc3545";
                  })(),
                }}
                aria-valuenow={getNetBalance()}
                aria-valuemin="0"
                aria-valuemax={getTotalIncome()}
              ></div>
            </div>
            <small className="mt-1 d-block" style={{ fontSize: "0.7rem" }}>
              {Math.round(getBalancePercentage())}% {t("remaining")}{" "}
              {t("ofTotalIncome")}
            </small>
            {getExpenseWarning() && (
              <div
                className="alert alert-warning p-1 mt-1 mb-0"
                style={{ fontSize: "0.7rem" }}
              >
                {getExpenseWarning()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
