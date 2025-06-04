import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import { DollarSign } from "lucide-react";

const SavingsForm = ({
  t,
  savingsGoal,
  setSavingsGoal,
  getSavingsProgress,
  getNetBalance
}) => {
  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">{t("savingsGoal")}</h5>
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-success text-white">
          <DollarSign size={18} />
        </InputGroup.Text>
        <Form.Control
          value={savingsGoal}
          onChange={(e) => {
            setSavingsGoal(e.target.value);
            localStorage.setItem("savingsGoal", e.target.value);
          }}
          type="number"
          min="0"
          step="100"
          placeholder={t("enterSavingsGoal")}
        />
      </InputGroup>

      <div className="mt-4">
        <h6 className="fw-bold">{t("savingsProgress")}</h6>
        <ProgressBar
          now={getSavingsProgress()}
          label={`${Math.round(getSavingsProgress())}%`}
          variant={getSavingsProgress() >= 100 ? "success" : "primary"}
          className="mt-2"
        />
        <small className="text-muted mt-2 d-block">
          {t("currentSavings")}: ${getNetBalance()} / ${savingsGoal}
        </small>
      </div>
    </div>
  );
};

export default SavingsForm; 