import { get, ref } from "firebase/database";
import { db } from "./firebaseConfig"; // Import the db instance from firebaseConfig

// Fetch the user data from Firebase
const getUserData = async (userId) => {
  if (!userId) {
    console.error("User ID is missing");
    return null;
  }
  try {
    // Get expenses data
    const expensesRef = ref(db, `users/${userId}/expenses`);
    const expensesSnapshot = await get(expensesRef);
    
    // Get income data
    const incomeRef = ref(db, `users/${userId}/income`);
    const incomeSnapshot = await get(incomeRef);
    
    // Get monthly target
    const targetRef = ref(db, `users/${userId}/monthlyTarget`);
    const targetSnapshot = await get(targetRef);
    
    // Get savings goal
    const savingsGoalRef = ref(db, `users/${userId}/savingGoal`);
    const savingsGoalSnapshot = await get(savingsGoalRef);

    const userData = {
      expenses: expensesSnapshot.exists() ? expensesSnapshot.val() : {},
      income: incomeSnapshot.exists() ? incomeSnapshot.val() : {},
      monthlyTarget: targetSnapshot.exists() ? targetSnapshot.val() : 0,
      savingsGoal: savingsGoalSnapshot.exists() ? savingsGoalSnapshot.val() : 0
    };

    localStorage.setItem("data", JSON.stringify(userData)); // Save data to localStorage
    return userData; // Return the fetched data
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// // Initialize Firebase
export default getUserData;
