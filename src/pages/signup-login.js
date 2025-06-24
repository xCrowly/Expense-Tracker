import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import signIn from "../components/firebase/signIn";
import signUp from "../components/firebase/signUp";
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
    <Container
      fluid
      className="py-4 min-vh-100 d-flex align-items-center justify-content-center"
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg">
            <Card.Header className="bg-white text-center border-0 pt-4 pb-3">
              <h2 className="text-primary mb-0">Welcome</h2>
              <p className="text-muted">Sign in or create your account</p>
            </Card.Header>

            <Card.Body className="px-4 py-4">
              {error && (
                <Alert variant="danger" className="mb-4 text-center">
                  {error}
                </Alert>
              )}

              <div className="text-center mb-4">
                <small className="text-muted">
                  Hint: you can use any random email!
                </small>
              </div>

              <Form>
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Form.Label className="fw-bold">Email address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      onChange={handleName}
                      value={email}
                      type="email"
                      placeholder="Enter your email"
                      className="py-2"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light">
                      <FaLock />
                    </InputGroup.Text>
                    <Form.Control
                      onChange={handlePassword}
                      value={password}
                      type="password"
                      placeholder="Enter your password"
                      className="py-2"
                    />
                  </InputGroup>
                  <Form.Text className="text-muted mt-2">
                    Minimum 6 characters required.
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button
                    onClick={handleSubmitSignIn}
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing In...
                      </span>
                    ) : (
                      <span>
                        <FaSignInAlt className="me-2" /> Sign In
                      </span>
                    )}
                  </Button>

                  <Button
                    onClick={handleSubmitSignUp}
                    variant="outline-secondary"
                    size="lg"
                    className="py-2"
                    disabled={loadingSignUp}
                  >
                    {loadingSignUp ? (
                      <span>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating Account...
                      </span>
                    ) : (
                      <span>
                        <FaUserPlus className="me-2" /> Create Account
                      </span>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupPage;
