import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import { formatMonth } from "./history";
import { IncomeTable } from "../components/IncomeTable";
import removeIncomeData from "../components/firebase/removeIncomeData";

// Group income data by month
const groupIncomeByMonth = (data) => {
  const grouped = {};
  data.forEach(([key, entry]) => {
    if (!entry || !entry.date) return;

    const month = entry.date.substr(0, 7); // Get YYYY-MM format
    if (!grouped[month]) {
      grouped[month] = { entries: [], total: 0 };
    }
    const amount = parseInt(entry.amount) || 0;
    grouped[month].entries.push({ 
      key, 
      ...entry,
      amount: amount // Ensure amount is stored as integer
    });
    grouped[month].total += amount;
  });

  // Sort entries within each month by date in descending order and then by timestamp
  Object.values(grouped).forEach(monthData => {
    monthData.entries.sort((a, b) => {
      if (b.date !== a.date) {
        return b.date.localeCompare(a.date);
      }
      // If dates are equal, sort by timestamp in descending order
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
  });

  return grouped;
};

function IncomeHistory() {
  const [processedData, setProcessedData] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    if (
      localStorage.getItem("email") == null &&
      window.location.pathname === "/income-history"
    ) {
      navigate("/");
    }
    if (localStorage.getItem("data")) {
      try {
        const userData = JSON.parse(localStorage.getItem("data"));
        // Get income data from the nested structure
        const incomeData = userData.income || {};
        
        // Convert object to array of entries and filter out invalid entries
        const data = Object.entries(incomeData)
          .filter(([_, entry]) => entry && entry.date && entry.amount && entry.source)
          .map(([key, entry]) => [
            key,
            {
              ...entry,
              amount: parseInt(entry.amount) || 0 // Ensure amount is parsed as integer
            }
          ])
          .sort((a, b) => {
            if (b[1].date !== a[1].date) {
              return b[1].date.localeCompare(a[1].date);
            }
            // If dates are equal, sort by timestamp in descending order
            return (b[1].timestamp || 0) - (a[1].timestamp || 0);
          });

        setProcessedData(data);
      } catch (error) {
        console.error("Error processing income history data:", error);
        setProcessedData([]);
      }
    }
  }, [navigate]);

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
      await removeIncomeData(userId, entryId);

      // Update local state and localStorage
      const userData = JSON.parse(localStorage.getItem("data") || "{}");
      if (userData.income && userData.income[entryId]) {
        delete userData.income[entryId];
        localStorage.setItem("data", JSON.stringify(userData));

        // Update processed data state
        const updatedData = Object.entries(userData.income || {})
          .filter(([_, entry]) => entry && entry.date && entry.amount && entry.source)
          .map(([key, entry]) => [
            key,
            {
              ...entry,
              amount: parseInt(entry.amount) || 0
            }
          ])
          .sort((a, b) => {
            if (b[1].date !== a[1].date) {
              return b[1].date.localeCompare(a[1].date);
            }
            return (b[1].timestamp || 0) - (a[1].timestamp || 0);
          });

        setProcessedData(updatedData);
      }
    } catch (error) {
      console.error("Error removing income data:", error);
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
          <span className="text-primary fw-bold mx-2">
            {t("total")}: ${total}
          </span>
        </div>
      </Accordion.Header>
      <Accordion.Body className="acc-body">
        <IncomeTable 
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

  const groupedData = groupIncomeByMonth(processedData);

  return (
    <div className="history-size rounded-1">
      <h2 className="mb-4 text-white">{t("incomeHistory")}</h2>
      <div className="mb-3 text-white">
      </div>
      <Accordion id="acc-body1">
        {Object.entries(groupedData).map(([month, { entries, total }]) =>
          renderMonthAccordion(month, entries, total)
        )}
      </Accordion>
    </div>
  );
}

export default IncomeHistory; 