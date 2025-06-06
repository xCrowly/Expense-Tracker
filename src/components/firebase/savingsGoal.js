import { ref, set, get } from "firebase/database";
import { db } from "./firebaseConfig";

// Save savings goal to Firebase
export const setSavingsGoal = async (userId, amount) => {
  if (!userId) {
    console.error("User ID is missing");
    throw new Error("User ID is required");
  }
  
  try {
    // Validate the amount
    const goalAmount = Number(amount);
    if (isNaN(goalAmount) || goalAmount < 0) {
      throw new Error("Savings goal must be a non-negative number");
    }
    
    // Save to Firebase
    await set(ref(db, `users/${userId}/savingGoal`), goalAmount);
    console.log("Savings goal updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating savings goal:", error);
    throw error;
  }
};

// Get savings goal from Firebase
export const getSavingsGoal = async (userId) => {
  if (!userId) {
    console.error("User ID is missing");
    return 0;
  }
  
  try {
    const savingsRef = ref(db, `users/${userId}/savingGoal`);
    const snapshot = await get(savingsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return 0; // Default value if no savings goal is set
    }
  } catch (error) {
    console.error("Error fetching savings goal:", error);
    return 0;
  }
}; 