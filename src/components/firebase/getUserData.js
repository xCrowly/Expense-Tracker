import { get, ref } from "firebase/database";
import { db } from "./firebaseConfig"; // Import the db instance from firebaseConfig

// Fetch the user data from Firebase
const getUserData = async (userId) => {
  if (!userId) {
    console.error("User ID is missing");
    return null;
  }
  try {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      localStorage.setItem("data", JSON.stringify(userData)); // Save data to localStorage
      return userData; // Return the fetched data
    } else {
      localStorage.setItem("data", ""); // Clear localStorage if no data exists
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// // Initialize Firebase
export default getUserData;
