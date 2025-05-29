import { ref, set, get } from "firebase/database";
import { db } from "./firebaseConfig";

// Save the monthly target to Firebase
export const saveMonthlyTarget = async (userId, targetAmount) => {
  try {
    if (targetAmount < 0) {
      throw new Error("Monthly target amount cannot be negative");
    }
    
    await set(ref(db, `users/${userId}/monthlyTarget`), Number(targetAmount));
    console.log("Monthly target saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving monthly target:", error);
    throw error;
  }
};

// Get the monthly target from Firebase
export const getMonthlyTarget = async (userId) => {
  try {
    const snapshot = await get(ref(db, `users/${userId}/monthlyTarget`));
    if (snapshot.exists()) {
      return snapshot.val().toString();
    }
    return "0"; // Default value if no target is set
  } catch (error) {
    console.error("Error getting monthly target:", error);
    throw error;
  }
};
