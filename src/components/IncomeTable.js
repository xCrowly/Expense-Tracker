import React from "react";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";

export const IncomeTable = ({ entries, total, t, showDelete = false, onDelete = null, loadingId = null }) => (
  <Table className="acc-table" striped bordered hover>
    <thead>
      <tr>
        <th className="fw-bold bg-info rounded-3">{t("day")}</th>
        <th className="fw-bold bg-info rounded-3">{t("source")}</th>
        <th className="fw-bold bg-info rounded-3">{t("note")}</th>
        <th className="text-white fw-bold bg-primary rounded-3">{t("amount")}</th>
        {showDelete && <th className="text-danger"></th>}
      </tr>
    </thead>
    <tbody>
      {entries.map(({ key, amount, source, note, date }) => (
        <tr key={key} id={key}>
          <td className="fw-bold">{date.substr(8)}</td>
          <td>{t(source.toLowerCase())}</td>
          <td>{note}</td>
          <td className="fw-bold">
            <span className="text-primary m-0 p-0">$</span>
            {parseInt(amount).toLocaleString()}
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
        <td className=""></td>
        <td className="bg-info text-text-black fw-bold rounded-3">{t("total")}</td>
        <td className="bg-primary text-white fw-bold rounded-3" colSpan={showDelete ? 2 : 1}>
          ${total}
        </td>
      </tr>
    </tbody>
  </Table>
); 