import { ref, remove } from "firebase/database";
import { db } from "./firebaseConfig"; // Import the db instance from firebaseConfig

// Remove the entry from Firebase
const removeUserData = async (userId, expenseId) => {
  if (!userId || !expenseId) {
    throw new Error("Both userId and expenseId are required");
  }

  try {
    const expenseRef = ref(db, `users/${userId}/expenses/${expenseId}`);
    await remove(expenseRef); // Remove the entry from Firebase
    console.log("Expense entry deleted successfully");
  } catch (error) {
    console.error("Error deleting expense entry:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export default removeUserData;
