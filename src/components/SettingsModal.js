import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  saveMonthlyTarget,
  getMonthlyTarget,
} from "./firebase/addMonthlyTarget";

function SettingsModal({
  show,
  handleClose,
  cashValues,
  setCashValues,
  quickNotes,
  setQuickNotes,
  onTargetUpdate,
}) {
  const [newCashValue, setNewCashValue] = useState("");
  const [newQuickNote, setNewQuickNote] = useState("");
  const [targetSpending, setTargetSpending] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);

  useEffect(() => {
    const fetchMonthlyTarget = async () => {
      try {
        const userId = localStorage.getItem("id");
        const target = await getMonthlyTarget(userId);
        setTargetSpending(target);
        onTargetUpdate(target);
        localStorage.setItem("targetSpending", target);
      } catch (error) {
        console.error("Error fetching monthly target:", error);
        // Fallback to localStorage
        const savedTarget = localStorage.getItem("targetSpending") || "0";
        setTargetSpending(savedTarget);
        onTargetUpdate(savedTarget);
      }
    };

    if (show) {
      fetchMonthlyTarget();
    }
  }, [show, onTargetUpdate]);

  // Add a new cash value
  const addCashValue = () => {
    if (newCashValue && !cashValues.includes(Number(newCashValue))) {
      const updatedCashValues = [...cashValues, Number(newCashValue)];
      setCashValues(updatedCashValues);
      localStorage.setItem("cashValues", JSON.stringify(updatedCashValues));
      setNewCashValue("");
    }
  };

  // Delete a cash value
  const deleteCashValue = (value) => {
    const updatedCashValues = cashValues.filter((cash) => cash !== value);
    setCashValues(updatedCashValues);
    localStorage.setItem("cashValues", JSON.stringify(updatedCashValues));
  };

  // Add a new quick note
  const addQuickNote = () => {
    if (newQuickNote && !quickNotes.includes(newQuickNote)) {
      const updatedQuickNotes = [...quickNotes, newQuickNote];
      setQuickNotes(updatedQuickNotes);
      localStorage.setItem("quickNotes", JSON.stringify(updatedQuickNotes));
      setNewQuickNote("");
    }
  };

  // Delete a quick note
  const deleteQuickNote = (note) => {
    const updatedQuickNotes = quickNotes.filter((n) => n !== note);
    setQuickNotes(updatedQuickNotes);
    localStorage.setItem("quickNotes", JSON.stringify(updatedQuickNotes));
  };

  // Update target spending temporarily
  const updateTargetSpending = (value) => {
    if (value >= 0) {
      setTargetSpending(value);
    }
  };

  // Save target spending to Firebase
  const saveTargetSpending = async () => {
    if (targetSpending >= 0) {
      setSavingTarget(true);
      try {
        const userId = localStorage.getItem("id");
        await saveMonthlyTarget(userId, targetSpending);
        localStorage.setItem("targetSpending", targetSpending);
        onTargetUpdate(targetSpending);
      } catch (error) {
        console.error("Error saving target:", error);
        alert("Failed to save target. Please try again.");
      } finally {
        setSavingTarget(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Target Spending Section */}
        <h5>Monthly Target Spending</h5>
        <div className="mb-4">
          <div className="d-flex gap-2">
            <Form.Control
              type="number"
              placeholder="Enter your monthly target spending"
              value={targetSpending}
              onChange={(e) => updateTargetSpending(e.target.value)}
              min="0"
            />
            <Button
              variant="success"
              onClick={saveTargetSpending}
              disabled={savingTarget}
            >
              {savingTarget ? "Saving..." : "Save Target"}
            </Button>
          </div>
          <small className="text-muted">
            Set your monthly spending target to help track your expenses
          </small>
        </div>

        {/* Cash Values Section */}
        <h5>Cash Values</h5>
        <div className="mb-3">
          <Form.Control
            type="number"
            placeholder="Enter a new cash value"
            value={newCashValue}
            onChange={(e) => setNewCashValue(e.target.value)}
          />
          <Button variant="secondary" onClick={addCashValue} className="mt-2">
            Add Cash Value
          </Button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {cashValues.map((value) => (
            <Button
              key={value}
              variant="outline-secondary"
              onClick={() => deleteCashValue(value)}
            >
              ${value} <span className="ms-2">×</span>
            </Button>
          ))}
        </div>

        {/* Quick Notes Section */}
        <h5 className="mt-4">Quick Notes</h5>
        <div className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter a new quick note"
            value={newQuickNote}
            onChange={(e) => setNewQuickNote(e.target.value)}
          />
          <Button variant="primary" onClick={addQuickNote} className="mt-2">
            Add Quick Note
          </Button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {quickNotes.map((note) => (
            <Button
              key={note}
              variant="outline-primary"
              onClick={() => deleteQuickNote(note)}
            >
              {note} <span className="ms-2">×</span>
            </Button>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SettingsModal;
