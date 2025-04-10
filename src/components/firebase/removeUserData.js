import { ref, remove } from "firebase/database";
import { db } from "./firebaseConfig"; // Import the db instance from firebaseConfig

// Remove the entry from Firebase
const removeUserData = async (userId, childId) => {
  try {
    const dataBaseRef = ref(db, `users/${userId}/${childId}`);
    await remove(dataBaseRef); // Remove the entry from Firebase
    console.log("Entry deleted successfully");
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export default removeUserData;
