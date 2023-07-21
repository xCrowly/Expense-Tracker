import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

function signIn(email, password) {

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then(
            (userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('email', user.email);
                localStorage.setItem('token', user.accessToken)
                localStorage.setItem('id', user.uid)
                getUserData(localStorage.getItem('id'))
                window.location.href = "/home";
                return;
            }
        )
        .catch(
            (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                alert(errorCode)
            }
        );

}

export default signIn;
