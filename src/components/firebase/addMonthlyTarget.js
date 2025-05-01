import { ref, set, get } from "firebase/database";
import { db } from "./firebaseConfig";

// Save the monthly target to Firebase
export const saveMonthlyTarget = async (userId, targetAmount) => {
  try {
    // Store the target as a regular expense-like entry with required fields
    await set(ref(db, `users/${userId}/${Date.now()}`), {
      cash: parseInt(targetAmount),
      date: new Date().toISOString().split("T")[0],
      note: "Monthly Target Setting",
      isTarget: true, // This field helps identify it as a target setting
    });
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
    const snapshot = await get(ref(db, `users/${userId}`));
    if (snapshot.exists()) {
      const data = Object.entries(snapshot.val());

      // Filter target entries and sort by timestamp (key) in descending order
      const targetEntries = data
        .filter(([_, entry]) => entry.isTarget)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]));

      // Get the most recent target entry
      if (targetEntries.length > 0) {
        const mostRecentTarget = targetEntries[0];
        return mostRecentTarget[1].cash.toString();
      }
    }
    return "0"; // Default value if no target is set
  } catch (error) {
    console.error("Error getting monthly target:", error);
    throw error;
  }
};
