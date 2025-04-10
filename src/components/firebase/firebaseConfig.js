// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR6aiIYUwDLuBtDeTI1A5_krxYPOLB6iM",
  authDomain: "expanse-tracker-e6806.firebaseapp.com",
  databaseURL:
    "https://expanse-tracker-e6806-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expanse-tracker-e6806",
  storageBucket: "expanse-tracker-e6806.appspot.com",
  messagingSenderId: "1054083508897",
  appId: "1:1054083508897:web:e39a246e81fccbccee1ee0",
};

// Initialize Firebase
const appDatabase = initializeApp(firebaseConfig);

export const db = getDatabase(appDatabase);
