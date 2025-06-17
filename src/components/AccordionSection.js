import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { formatMonth } from "../pages/history";
import { IncomeTable } from "./IncomeTable";
import { ExpenseTable } from "../pages/history";

const AccordionSection = ({
  type, // "income" or "expenses"
  t,
  language,
  data,
  showDelete,
  onDelete,
  loadingId
}) => {
  return (
    <div className="mb-4">
      <div className="mb-3">
        <h5 className="text-white fw-bold">{t(type)}</h5>
      </div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex justify-content-between w-100 fw-bold">
              <span>{formatMonth(new Date().toISOString().substring(0, 7), language)}</span>
              <span className={`text-${type === "income" ? "primary" : "success"} fw-bold mx-2`}>
                {t("total")}: ${data.total}
              </span>
            </div>
          </Accordion.Header>
          <Accordion.Body className="acc-body">
            {type === "income" ? (
              <IncomeTable
                entries={data.entries}
                total={data.total}
                t={t}
                showDelete={showDelete}
                onDelete={onDelete}
                loadingId={loadingId}
              />
            ) : (
              <ExpenseTable
                entries={data.entries}
                total={data.total}
                t={t}
                showDelete={showDelete}
                onDelete={onDelete}
                loadingId={loadingId}
              />
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default AccordionSection; 