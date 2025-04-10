import { push, ref } from "firebase/database";
import { db } from "./firebaseConfig"; // Import the db instance from firebaseConfig

// Add the entry to Firebase
const addUserData = async (userId, cash, date, note) => {
  try {
    await push(ref(db, "users/" + userId), {
      cash: cash,
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
