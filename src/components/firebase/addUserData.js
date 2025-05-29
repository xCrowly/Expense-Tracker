import { push, ref } from "firebase/database";
import { db } from "./firebaseConfig"; // Import the db instance from firebaseConfig

// Add the entry to Firebase
const addUserData = async (userId, cash, date, note) => {
  try {
    if (!cash || cash <= 0) {
      throw new Error("Cash amount must be greater than 0");
    }
    
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format. Use YYYY-MM-DD");
    }

    if (note.length > 100) {
      throw new Error("Note must be 100 characters or less");
    }

    await push(ref(db, `users/${userId}/expenses`), {
      cash: Number(cash),
      date: date,
      note: note,
    });
    console.log("Entry pushed successfully");
  } catch (error) {
    console.error("Error pushing entry:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// // Initialize Firebase
export default addUserData;
