import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import app from "./firebase/firebaseConfig";
import signIn from "./firebase/signIn";
import signUp from "./firebase/signUp";

function SignupPage() {

    // States for registration
    const [email, setName] = useState('');
    const [password, setPassword] = useState('');

    // States for checking the errors
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);

    // Handling the name change
    const handleName = (e) => {
        setName(e.target.value);
        setSubmitted(false);
        // console.log(e.target.value)
    };

    // Handling the password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
        // console.log(e.target.value)
    };

    // Handling the form submission
    const handleSubmitSignUp = (e) => {
        e.preventDefault();
        if (email === '' || password === '' || password.length < 6) {
            setError(true);
        } else {
            setSubmitted(true);
            signUp(email, password);
            setError(false);
        }
    };

    // Handling the form submission
    const handleSubmitSignIn = (e) => {
        e.preventDefault();
        if (email === '' || password === '' || password.length < 6) {
            setError(true);
        } else {
            setSubmitted(true);
            signIn(email, password);
            setError(false);
        }
    };

    // // Showing success message
    // const successMessage = () => {
    //     return (
    //         <div
    //             className="success"
    //             style={{
    //                 display: submitted ? '' : 'none',
    //             }}>
    //             <h4>User {name} successfully registered!!</h4>
    //         </div>
    //     );
    // };

    // Showing error message if error is true
    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                }}>
                <h4>Please enter a valid email & Password</h4>
            </div>
        );
    };

    return (

        <div className="login-size p-3 bg-light rounded-1">

            <div className="messages text-danger">
                {errorMessage()}
            </div>
            {/* <div className="messages text-success">
                {successMessage()}
            </div> */}

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
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button onClick={handleSubmitSignUp} type="submit" variant="primary">
                    SignUp
                </Button>
                <Button className="ms-3" onClick={handleSubmitSignIn}
                    type="submit" variant="primary" >
                    Login
                </Button>
            </Form>
        </div>
    )
}

// function Form1() {

//     // States for registration
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     // States for checking the errors
//     const [submitted, setSubmitted] = useState(false);
//     const [error, setError] = useState(false);

//     // Handling the name change
//     const handleName = (e) => {
//         setName(e.target.value);
//         setSubmitted(false);
//     };

//     // Handling the email change
//     const handleEmail = (e) => {
//         setEmail(e.target.value);
//         setSubmitted(false);
//     };

//     // Handling the password change
//     const handlePassword = (e) => {
//         setPassword(e.target.value);
//         setSubmitted(false);
//     };

//     // Handling the form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (name === '' || email === '' || password === '') {
//             setError(true);
//         } else {
//             setSubmitted(true);
//             setError(false);
//         }
//     };

//     // Showing success message
//     const successMessage = () => {
//         return (
//             <div
//                 className="success"
//                 style={{
//                     display: submitted ? '' : 'none',
//                 }}>
//                 <h1>User {name} successfully registered!!</h1>
//             </div>
//         );
//     };

//     // Showing error message if error is true
//     const errorMessage = () => {
//         return (
//             <div
//                 className="error"
//                 style={{
//                     display: error ? '' : 'none',
//                 }}>
//                 <h1>Please enter all the fields</h1>
//             </div>
//         );
//     };

//     return (
//         <div className="form">
//             <div>
//                 <h1>User Registration</h1>
//             </div>

//             {/* Calling to the methods */}
//             <div className="messages">
//                 {errorMessage()}
//                 {successMessage()}
//             </div>

//             <form>
//                 {/* Labels and inputs for form data */}
//                 <label className="label">Name</label>
//                 <input onChange={handleName} className="input"
//                     value={name} type="text" />

//                 <label className="label">Email</label>
//                 <input onChange={handleEmail} className="input"
//                     value={email} type="email" />

//                 <label className="label">Password</label>
//                 <input onChange={handlePassword} className="input"
//                     value={password} type="password" />

//                 <button onClick={handleSubmit} className="btn"
//                     type="submit">
//                     Submit
//                 </button>
//             </form>
//         </div>
//     );
// }

export default SignupPage;


