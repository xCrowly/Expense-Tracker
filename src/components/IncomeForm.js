import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import { DollarSign, NotebookPen, History, CalendarDays, Save } from "lucide-react";

const IncomeForm = ({
  t,
  income,
  setIncome,
  incomeSource,
  setIncomeSource,
  incomeDate,
  setIncomeDate,
  incomeNote,
  setIncomeNote,
  errorMessage,
  loading,
  handleIncomeSubmit,
  incomeSources
}) => {
  return (
    <Form onSubmit={handleIncomeSubmit}>
      <Form.Label className="fw-bold">{t("income")}:</Form.Label>
      <div className="messages text-danger">{errorMessage()}</div>
      <InputGroup>
        <InputGroup.Text className="bg-primary text-white">
          <DollarSign size={18} />
        </InputGroup.Text>
        <Form.Control
          value={income}
          onChange={(e) => {
            const value = Math.floor(Number(e.target.value));
            if (value >= 1 || e.target.value === '') {
              setIncome(e.target.value === '' ? '' : value);
            }
          }}
          type="number"
          min="1"
          step="1"
          onKeyDown={(e) => {
            if (e.key === '.' || e.key === '-' || e.key === 'e') {
              e.preventDefault();
            }
          }}
          id="incomeValue"
        />
      </InputGroup>

      <Form.Group className="my-3">
        <Form.Label className="fw-bold">{t("source")}:</Form.Label>
        <Form.Select
          value={incomeSource}
          onChange={(e) => setIncomeSource(e.target.value)}
        >
          <option value="">{t("selectSource")}</option>
          {incomeSources.map((source) => (
            <option key={source} value={source}>
              {t(source.toLowerCase())}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <label htmlFor="incomeDate" className="ms-3 fw-bold">
        <CalendarDays className="me-2" size={28} />
        {t("date")}:{" "}
      </label>
      <input
        value={incomeDate}
        onChange={(e) => setIncomeDate(e.target.value)}
        type="date"
        id="incomeDateValue"
        name="incomeDate"
        className="m-3 p-1 w-max rounded-2 border-0 shadow-sm"
      />

      <InputGroup>
        <InputGroup.Text className="bg-warning text-dark fw-bold">
          <NotebookPen className="me-2" size={18} />
          {t("note")}
        </InputGroup.Text>
        <Form.Control
          value={incomeNote}
          onChange={(e) => setIncomeNote(e.target.value)}
          id="incomeNoteValue"
        />
      </InputGroup>

      <div className="d-flex justify-content-end mt-3">
        <Link
          to="/income-history"
          className="btn bg-success text-white button m-1 w-auto col"
        >
          <History className="me-2" size={22} />
          {t("incomeHistory")}
        </Link>
        <Button
          variant="primary"
          type="submit"
          className="btn bg-primary text-white button m-1 w-auto col"
          disabled={loading}
        >
          <Save className="me-2" size={22} />
          {loading ? t("submitting") : t("submit")}
        </Button>
      </div>
    </Form>
  );
};

export default IncomeForm; 