import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import signIn from "./firebase/signIn";
import signUp from "./firebase/signUp";

function SignupPage() {
    // States for registration
    const [email, setName] = useState('');
    const [password, setPassword] = useState('');

    // states for form errors
    const [error, setError] = useState(false);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    // Handling the form submission
    const handleSubmitSignUp = async (e) => {
        e.preventDefault();
        if (email === '' || password === '' || password.length < 6) {
            setError(true);
        } else {
            signUp(email, password)
            setError(false);
        }
    };

    // Handling the form submission
    const handleSubmitSignIn = async (e) => {
        e.preventDefault();
        if (email === '' || password === '' || password.length < 6) {
            setError(true);
        } else {
            signIn(email, password)
            setError(false);
        }
    };

    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                }}>
                <h4>Please enter a valid email & a minimum 6 digit Password</h4>
            </div>
        );
    };

    return (

        <div className="login-size p-3 bg-light rounded-1 shadow mt-4">

            <div className="messages text-danger">
                {errorMessage()}
            </div>

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control onChange={handleName} className="input"
                        value={email} type="text" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={handlePassword} className="input"
                        value={password} type="password" />
                    <Form.Text className="text-muted">
                        Minimum 6 characters.
                    </Form.Text>
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
                <div className="d-flex justify-content-end">
                    <Button onClick={handleSubmitSignUp} type="submit" variant="primary">
                        SignUp
                    </Button>
                    <Button className="ms-3" onClick={handleSubmitSignIn}
                        type="submit" variant="outline-success" >
                        Login
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SignupPage;


