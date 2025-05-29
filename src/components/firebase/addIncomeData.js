import { ref, push } from "firebase/database";
import { db } from "./firebaseConfig";

const addIncomeData = async (userId, amount, source, date, note) => {
  try {
    const incomeRef = ref(db, `users/${userId}/income`);
    await push(incomeRef, {
      amount: amount,
      source: source,
      date: date,
      note: note,
      timestamp: Date.now()
    });
    return true;
  } catch (error) {
    console.error("Error adding income data:", error);
    throw error;
  }
};

export default addIncomeData; 