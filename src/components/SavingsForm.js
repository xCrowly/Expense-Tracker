import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import { DollarSign } from "lucide-react";
import { setSavingsGoal } from "./firebase/savingsGoal";
import { useAuth } from "../contexts/AuthContext"; // Assuming you have an AuthContext

const SavingsForm = ({
  t,
  savingsGoal,
  setSavingsGoal: updateSavingsGoal,
  getSavingsProgress,
  getNetBalance,
}) => {
  const { currentUser } = useAuth(); // Get the current user from auth context

  const handleSavingsGoalChange = async (e) => {
    const newGoal = e.target.value;
    updateSavingsGoal(newGoal);

    // Save to Firebase if user is logged in
    if (currentUser && currentUser.uid) {
      try {
        await setSavingsGoal(currentUser.uid, newGoal);
      } catch (error) {
        console.error("Failed to update savings goal:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">{t("savingsGoal")}</h5>
      <InputGroup className="mb-3">
        <InputGroup.Text className="bg-success text-white">
          <DollarSign size={18} />
        </InputGroup.Text>
        <Form.Control
          value={savingsGoal}
          onChange={handleSavingsGoalChange}
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
