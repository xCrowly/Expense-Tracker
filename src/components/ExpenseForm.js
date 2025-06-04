import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { DollarSign, NotebookPen, History, CalendarDays, Save } from "lucide-react";

const ExpenseForm = ({
  t,
  cash,
  setCash,
  date,
  setDate,
  note,
  setNote,
  errorMessage,
  loading,
  handleSubmit,
  cashValues,
  quickNotes
}) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Label className="fw-bold">{t("expenses")}:</Form.Label>
      <div className="messages text-danger">{errorMessage()}</div>
      <InputGroup>
        <InputGroup.Text className="bg-success text-white">
          <DollarSign size={18} />
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
      <div className="my-1">
        <p className="mb-2 fw-bold">{t("quickCash")}:</p>
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
        <CalendarDays className="me-2" size={28} />
        {t("date")}:{" "}
      </label>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
        id="dateValue"
        name="date"
        className="m-3 p-1 w-max rounded-2 border-0 shadow-sm"
      />

      <InputGroup>
        <InputGroup.Text id="Note" className="bg-warning text-dark fw-bold">
          <NotebookPen className="me-2" size={18} />
          {t("note")}
        </InputGroup.Text>
        <Form.Control
          value={note}
          onChange={(e) => setNote(e.target.value)}
          id="noteValue"
        />
      </InputGroup>

      {/* Quick Notes Buttons */}
      <div className="my-1">
        <p className="mb-2 fw-bold">{t("quickNotes")}:</p>
        <div className="d-flex flex-wrap justify-content-start gap-2">
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
      <div className="d-flex justify-content-between align-items-center flex-shrink-1 ">
        <Link
          to="/history"
          className="btn bg-success text-white button m-1 w-auto col"
        >
          <History className="me-2" size={22} />
          {t("history")}
        </Link>
        <Button
          variant="danger"
          type="submit"
          className="m-1 text-white w-auto col"
          disabled={loading}
        >
          <Save className="me-2" size={22} />
          {loading ? t("submitting") : t("submit")}
        </Button>
      </div>
    </Form>
  );
};

export default ExpenseForm; 