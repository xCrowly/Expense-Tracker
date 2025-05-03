import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import removeUserData from "./firebase/removeUserData";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";

// Export utility functions
export const formatMonth = (monthStr, language) => {
  if (language === "ar") {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return new Intl.DateTimeFormat("ar", {
      year: "numeric",
      month: "long",
      calendar: "gregory",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
  }).format(new Date(monthStr));
};

export const groupDataByMonth = (data) => {
  const grouped = {};
  data.forEach(([key, entry]) => {
    // Skip target entries
    if (entry.isTarget) return;

    const month = entry.date.substr(0, 7);
    if (!grouped[month]) {
      grouped[month] = { entries: [], total: 0 };
    }
    grouped[month].entries.push({ key, ...entry });
    grouped[month].total += parseInt(entry.cash);
  });
  return grouped;
};

// Export the table component for reuse
export const ExpenseTable = ({ entries, total, t, showDelete = false, onDelete = null, loadingId = null }) => (
  <Table className="acc-table" striped bordered hover>
    <thead>
      <tr>
        <th className="fw-bold bg-info rounded-3">{t("day")}</th>
        <th className="fw-bold bg-info rounded-3">{t("note")}</th>
        <th className="text-white fw-bold bg-success rounded-3">{t("amount")}</th>
        {showDelete && <th className="text-danger"></th>}
      </tr>
    </thead>
    <tbody>
      {entries.map(({ key, cash, note, date }) => (
        <tr key={key} id={key}>
          <td className="fw-bold">{date.substr(8)}</td>
          <td>{note}</td>
          <td className="fw-bold">
            <span className="text-success m-0 p-0">$</span>
            {cash}
          </td>
          {showDelete && (
            <td
              className="acc-btn fw-bold rounded-3"
              onClick={() => onDelete && onDelete(key)}
              role="button"
              aria-label={t("deleteEntry")}
              style={{
                pointerEvents: loadingId === key ? "none" : "auto",
                opacity: loadingId === key ? 0.5 : 1,
              }}
            >
              {loadingId === key ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "✕"
              )}
            </td>
          )}
        </tr>
      ))}
      <tr>
        <td className=""></td>
        <td className="bg-info text-text-black fw-bold rounded-3">{t("total")}</td>
        <td className="bg-success text-white fw-bold rounded-3" colSpan={showDelete ? 2 : 1}>
          ${total}
        </td>
      </tr>
    </tbody>
  </Table>
);

function History() {
  const [processedData, setProcessedData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    if (
      localStorage.getItem("email") == null &&
      window.location.pathname === "/history"
    ) {
      navigate("/");
    }
    if (localStorage.getItem("data")) {
      const data = Object.entries(
        JSON.parse(localStorage.getItem("data"))
      ).sort((a, b) => {
        return (
          parseInt(b[1].date.split("-").join("")) -
          parseInt(a[1].date.split("-").join(""))
        );
      });
      // Filter out target entries
      const expensesOnly = data.filter(([_, entry]) => !entry.isTarget);
      setProcessedData(expensesOnly);
    }
  }, [navigate]);

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

      // Update local state to remove the deleted entry
      setProcessedData((prevData) => {
        const updatedData = prevData.filter(([key]) => key !== entryId);
        // Filter out target entries before storing in localStorage
        const expensesOnly = updatedData.filter(
          ([_, entry]) => !entry.isTarget
        );
        localStorage.setItem(
          "data",
          JSON.stringify(Object.fromEntries(expensesOnly))
        );
        return updatedData;
      });
    } catch (error) {
      console.error("Error removing data:", error);
      alert(t("failedToRemove"));
    } finally {
      setLoadingId(null);
    }
  };

  const renderMonthAccordion = (month, entries, total) => (
    <Accordion.Item key={month} eventKey={month}>
      <Accordion.Header>
        <div className="d-flex justify-content-between w-100 fw-bold">
          <span>{formatMonth(month, language)}</span>
          <span className="text-success fw-bold mx-2">
            {t("total")}: ${total}
          </span>
        </div>
      </Accordion.Header>
      <Accordion.Body className="acc-body">
        <ExpenseTable 
          entries={entries} 
          total={total} 
          t={t} 
          showDelete={true}
          onDelete={(key) => handleRemove(key)}
          loadingId={loadingId}
        />
      </Accordion.Body>
    </Accordion.Item>
  );

  const groupedData = groupDataByMonth(processedData);

  return (
    <div className="history-size rounded-1">
      <h2 className="mb-4 text-white">{t("expenseHistory")}</h2>
      <Accordion id="acc-body1">
        {Object.entries(groupedData).map(([month, { entries, total }]) =>
          renderMonthAccordion(month, entries, total)
        )}
      </Accordion>
    </div>
  );
}

export default History;
