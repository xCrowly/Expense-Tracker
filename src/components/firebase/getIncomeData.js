import { ref, get } from "firebase/database";
import { db } from "./firebaseConfig";

const getIncomeData = async (userId) => {
  try {
    const incomeRef = ref(db, `users/${userId}/income`);
    const snapshot = await get(incomeRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      localStorage.setItem("incomeData", JSON.stringify(data));
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error getting income data:", error);
    throw error;
  }
};

export default getIncomeData; 