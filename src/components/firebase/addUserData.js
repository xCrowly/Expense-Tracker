// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";

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

// Add the entry to Firebase
const addUserData = async (userId, cash, date, note) => {
    try {

        await push(ref(db, 'users/' + userId), {
            cash: cash,
            date: date,
            note: note
        });
        console.log("Entry pushed successfully");
    } catch (error) {
        console.error("Error pushing entry:", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

// // Initialize Firebase
export default addUserData;
