import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import removeUserData from "./firebase/removeUserData";

function History() {
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      setProcessedData(data);
    }
  }, [navigate]);

  const groupDataByMonth = (data) => {
    const grouped = {};
    data.forEach(([key, entry]) => {
      const month = entry.date.substr(0, 7);
      if (!grouped[month]) {
        grouped[month] = { entries: [], total: 0 };
      }
      grouped[month].entries.push({ key, ...entry });
      grouped[month].total += parseInt(entry.cash);
    });
    return grouped;
  };
  // Handle removal of an entry
  const handleRemove = async (entryId) => {
    const userId = localStorage.getItem("id");
    if (!userId || !entryId) {
      console.error("User ID or Entry ID is missing");
      return;
    }

    setLoading(true);
    try {
      // Remove the entry from Firebase
      await removeUserData(userId, entryId);

      // Update local state to remove the deleted entry
      setProcessedData((prevData) => {
        const updatedData = prevData.filter(([key]) => key !== entryId);
        localStorage.setItem(
          "data",
          JSON.stringify(Object.fromEntries(updatedData))
        );
        return updatedData;
      });
    } catch (error) {
      console.error("Error removing data:", error);
      alert("Failed to remove entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderMonthAccordion = (month, entries, total) => (
    <Accordion.Item key={month} eventKey={month}>
      <Accordion.Header>
        <div className="d-flex justify-content-between w-100">
          <span>{month}</span>
          <span className="text-success fw-bold mx-2">Total: ${total}</span>
        </div>
      </Accordion.Header>
      <Accordion.Body className="acc-body">
        <Table className="acc-table" striped bordered hover>
          <thead>
            <tr>
              <th className="text-success">Amount</th>
              <th>Note</th>
              <th>Day</th>
              <th className="text-danger"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(({ key, cash, note, date }) => (
              <tr key={key} id={key}>
                <td>{cash}</td>
                <td>{note}</td>
                <td>{date.substr(8)}</td>
                <td
                  className="acc-btn"
                  onClick={() => !loading && handleRemove(key)}
                  role="button"
                  aria-label="Delete entry"
                  style={{
                    pointerEvents: loading ? "none" : "auto",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  X
                  {loading && (
                    <Spinner animation="border" size="sm" className="ms-2" />
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="bg-success text-white">Total</td>
              <td className="bg-primary text-white">${total}</td>
            </tr>
          </tbody>
        </Table>
      </Accordion.Body>
    </Accordion.Item>
  );

  const groupedData = groupDataByMonth(processedData);

  return (
    <div className="history-size rounded-1">
      <Accordion id="acc-body1">
        {Object.entries(groupedData).map(([month, { entries, total }]) =>
          renderMonthAccordion(month, entries, total)
        )}
      </Accordion>
    </div>
  );
}

export default History;
