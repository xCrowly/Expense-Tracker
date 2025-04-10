import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import getUserData from "./getUserData";

const auth = getAuth();

// Sign in with email and password
const signIn = async (email, password, navigate) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store user information in localStorage (for demonstration purposes only)
    localStorage.setItem("email", user.email);
    localStorage.setItem("id", user.uid);
    localStorage.setItem("token", user.accessToken);

    // Fetch user data
    await getUserData(user.uid);

    // Navigate to the home page
    if (navigate) {
      navigate("/home");
    }
  } catch (error) {
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
};

export default signIn;
