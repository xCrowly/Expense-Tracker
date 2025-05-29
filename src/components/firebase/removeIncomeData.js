import { ref, remove } from "firebase/database";
import { db } from "./firebaseConfig";

const removeIncomeData = async (userId, incomeId) => {
  try {
    const incomeRef = ref(db, `users/${userId}/income/${incomeId}`);
    await remove(incomeRef);
    return true;
  } catch (error) {
    console.error("Error removing income data:", error);
    throw error;
  }
};

export default removeIncomeData; 