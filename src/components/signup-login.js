import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function SignupPage() {
    return (
        <div className="login-size p-3 bg-light rounded-1">
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="email" placeholder="User name" />
                    <Form.Text className="text-muted">
                        Minimum 4 characters.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                    <Form.Text className="text-muted">
                        Minimum 8 characters.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    SignUp
                </Button>
                <Button className="ms-3" variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    )
}

export default SignupPage;