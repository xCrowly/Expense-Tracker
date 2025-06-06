import { ref, get } from "firebase/database";
import { db } from "./firebaseConfig";

const getIncomeData = async (userId) => {
  try {
    const incomeRef = ref(db, `users/${userId}/income`);
    const snapshot = await get(incomeRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      // Update both incomeData and the nested income in the main userData object
      localStorage.setItem("incomeData", JSON.stringify(data));
      
      // Update the income data in the main userData object as well
      try {
        const userData = JSON.parse(localStorage.getItem("data") || "{}");
        userData.income = data;
        localStorage.setItem("data", JSON.stringify(userData));
      } catch (err) {
        console.error("Error updating income in userData:", err);
      }
      
      return data;
    }
    
    // If no data exists, ensure we clear any stale income data
    localStorage.setItem("incomeData", JSON.stringify({}));
    try {
      const userData = JSON.parse(localStorage.getItem("data") || "{}");
      userData.income = {};
      localStorage.setItem("data", JSON.stringify(userData));
    } catch (err) {
      console.error("Error clearing income in userData:", err);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting income data:", error);
    throw error;
  }
};

export default getIncomeData; 