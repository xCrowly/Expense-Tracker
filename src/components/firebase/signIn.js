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

const auth = getAuth();

// Sign in with email and password
const signIn = async (email, password, navigate) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user information in localStorage (for demonstration purposes only)
        localStorage.setItem("email", user.email);
        localStorage.setItem("id", user.uid);
        localStorage.setItem('token', user.accessToken);

        // Fetch user data
        await getUserData(user.uid);

        // Navigate to the home page
        if (navigate) {
            navigate("/home");
        }
    }
    catch (error) {
        console.error("Error signing in:", error);

        // Provide user-friendly error messages
        let errorMessage = "An error occurred during sign-in. Please try again.";
        switch (error.code) {
            case "auth/invalid-email":
                errorMessage = "Invalid email address.";
                break;
            case "auth/user-not-found":
                errorMessage = "User not found.";
                break;
            case "auth/wrong-password":
                errorMessage = "Incorrect password.";
                break;
            case "auth/too-many-requests":
                errorMessage = "Too many failed attempts. Please try again later.";
                break;
            default:
                errorMessage = error.message;
        }

        throw new Error(errorMessage); // Re-throw the error to handle it in the calling component
    }
}


export default signIn;
