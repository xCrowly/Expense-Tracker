import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import signIn from "./firebase/signIn";
import signUp from "./firebase/signUp";
import { useNavigate } from "react-router-dom";

/**
 * SignupPage component allows users to sign up or log in using their email and password.
 * It handles form submission, input changes, and displays error messages for invalid inputs.
 */

function SignupPage() {
  // States for registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSignUp, setloadingSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use the useNavigate hook

  // Handling the name change
  const handleName = (e) => {
    setEmail(e.target.value);
  };

  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Handling the form submission signup
  const handleSubmitSignUp = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate inputs
    if (email === "" || password === "" || password.length < 6) {
      setError(
        "Please fill in all fields and ensure the password is at least 6 characters long."
      );
      return;
    }
    setloadingSignUp(true); // Set loading state to true
    setError(""); // Clear any previous errors

    try {
      // Call the signUp function
      await signUp(email, password);

      // Redirect to the home page after successful sign-up
      navigate("/home");
    } catch (error) {
      // Handle errors
      console.error("Error during sign-up:", error);
      setError(error.message); // Display a user-friendly error message
    } finally {
      setloadingSignUp(false); // Set loading state to false
    }
  };

  // Handling the form submission signin
  const handleSubmitSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = await signIn(email, password, navigate);
      console.log("Signed in successfully:", user);
      navigate("/home"); // Navigate to the home page after successful sign-in
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-3">
      <div className="login-signup">
        <div className="pb-3">
          <div className="d-flex justify-content-center text-white">
            <b>
              Hint:
              <span className="fs-6 fw-light">
                {" "}
                you can use any random email.
              </span>
            </b>
          </div>
        </div>
        <div className="login-size rounded-4 p-3 bg-light rounded-1 shadow mt-1">
          <div className="messages text-danger">
            {error && <div className="error">{error}</div>}
          </div>

          <Form className="p-3">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="fw-bold">Enter Email address:</Form.Label>
              <Form.Control
                onChange={handleName}
                className="input"
                value={email}
                type="text"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="fw-bold">Password:</Form.Label>
              <Form.Control
                onChange={handlePassword}
                className="input"
                value={password}
                type="password"
              />
              <Form.Text className="text-muted">
                Minimum 6 characters.
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                className="rounded-2"
                onClick={handleSubmitSignUp}
                variant="outline-primary"
              >
                {loadingSignUp ? "Signing Up..." : "Sign Up"}
              </Button>
              <Button
                className="ms-3"
                onClick={handleSubmitSignIn}
                type="submit"
                variant="success"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
