// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBR6aiIYUwDLuBtDeTI1A5_krxYPOLB6iM",
    authDomain: "expanse-tracker-e6806.firebaseapp.com",
    databaseURL: "https://expanse-tracker-e6806-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "expanse-tracker-e6806",
    storageBucket: "expanse-tracker-e6806.appspot.com",
    messagingSenderId: "1054083508897",
    appId: "1:1054083508897:web:e39a246e81fccbccee1ee0"
};

const appDatabase = initializeApp(firebaseConfig);
const db = getDatabase(appDatabase);

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
