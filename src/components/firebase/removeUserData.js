// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, remove } from "firebase/database";
import getUserData from "./getUserData";

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

function removeUserData(userId, childId) {
    const appDatabase = initializeApp(firebaseConfig);
    const db = getDatabase(appDatabase);
    const dataBaseRef = ref(db, "users/" + userId + "/" + childId)
    remove(dataBaseRef)
    document.getElementById(childId).remove();
    getUserData(localStorage.getItem('id'))
}

// // Initialize Firebase
export default removeUserData;
