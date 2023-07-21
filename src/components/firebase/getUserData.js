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

function getUserData(userId) {
    const appDatabase = initializeApp(firebaseConfig);
    const db = getDatabase(appDatabase);

    get(child(ref(db), "users/" + userId)).then((snapshot) => {
        if (snapshot.exists()) {
            // get the user data and save it into local storage
            localStorage.setItem("data", JSON.stringify(snapshot.val()))
        } else {
            localStorage.setItem("data", '')
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

}

// // Initialize Firebase
export default getUserData;
