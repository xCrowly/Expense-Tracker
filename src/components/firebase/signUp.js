import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

// Function to sign up a new user
const signUp = async (email, password) => {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store user information in localStorage (for demonstration purposes only)
    localStorage.setItem("email", user.email);
    localStorage.setItem("id", user.uid);
    localStorage.setItem("token", user.accessToken);

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
};

export default signUp;
