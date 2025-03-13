import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

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

// Function to sign up a new user
const signUp = async (email, password) => {
    const auth = getAuth();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user information in localStorage (for demonstration purposes only)
        localStorage.setItem("email", user.email);
        localStorage.setItem("id", user.uid);
        localStorage.setItem('token', user.accessToken);

        return { user }; // Return the user object
    } catch (error) {
        console.error("Error signing up:", error);
        // Provide user-friendly error messages
        let errorMessage = "An error occurred during sign-up. Please try again.";
        switch (error.code) {
            case "auth/email-already-in-use":
                errorMessage = "Email is already in use.";
                break;
            case "auth/invalid-email":
                errorMessage = "Invalid email address.";
                break;
            case "auth/weak-password":
                errorMessage = "Password should be at least 6 characters.";
                break;
            default:
                errorMessage = error.message;
        }
        throw new Error(errorMessage); // Re-throw the error to handle it in the calling component
    }
}

export default signUp;
