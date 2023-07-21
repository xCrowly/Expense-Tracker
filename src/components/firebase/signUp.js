import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import getUserData from "./getUserData";

const firebaseConfig = {
    apiKey: "AIzaSyBR6aiIYUwDLuBtDeTI1A5_krxYPOLB6iM",
    authDomain: "expanse-tracker-e6806.firebaseapp.com",
    databaseURL: "https://expanse-tracker-e6806-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "expanse-tracker-e6806",
    storageBucket: "expanse-tracker-e6806.appspot.com",
    messagingSenderId: "1054083508897",
    appId: "1:1054083508897:web:e39a246e81fccbccee1ee0"
};

initializeApp(firebaseConfig);

function signUp(email, password) {

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
        .then(
            (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                localStorage.setItem('email', user.email);
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('id', user.uid);
                getUserData(localStorage.getItem('id'))
                alert("Signed up successfully! 😊")
                window.location.href = "home";
            })
        .catch(
            (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                alert("Invalid or used email ⚠️")
            }
        );
}

export default signUp;
