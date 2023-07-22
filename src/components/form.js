import { React, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from "react-router-dom";
import addUserData from './firebase/addUserData';
import getUserData from "./firebase/getUserData";

function FormBody() {
    // get todays date
    var today = new Date();

    getUserData(localStorage.getItem('id'))
    const [error, setError] = useState(false);

    // get user name from email address
    function getName() {
        if (localStorage.getItem('email') != null) {
            const str = localStorage.getItem('email').split('@')
            return str[0];
        }
    }

    // chech if the user is signed in
    function CheckUser() {
        useEffect(() => {
            let token = localStorage.getItem('token');
            if (token === null &&
                window.location.pathname === "/home") {
                window.location.href = '/';
            }
        }, []);
    }
    CheckUser();

    // validating data before sending to the database
    function handleSubmit(e) {
        e.preventDefault();

        const cash = document.getElementById('cashValue');
        const date = document.getElementById('dateValue');
        const note = document.getElementById('noteValue');

        if (cash.value === '' || date.value === '') {
            setError(true);
        } else {
            setError(false);
            addUserData(
                localStorage.getItem('id'),
                Math.floor(cash.value),
                date.value,
                note.value
            )
            getUserData(localStorage.getItem('id'))

            // reset the input field
            cash.value = ''
            note.value = ''
        }
    }

    // display error message if the cash is invalid
    const errorMessage = () => {
        return (
            <div
                className="error"
                style={{
                    display: error ? '' : 'none',
                }}>
                <h4>Please enter cash</h4>
            </div>
        );
    };

    return (

        <div id="form-body" className="px-3">
            <div className="pb-3">
                <div className="d-flex justify-content-center">
                    <b>Hello, <i className="text-white">{getName()}</i></b>
                </div>
            </div>

            <div className="form-size bg-light rounded-1 shadow rounded-4">
                <Form>
                    <Form.Label >Expenses</Form.Label>
                    <div className="messages text-danger">
                        {errorMessage()}
                    </div>
                    <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control aria-label="Default" placeholder="0"
                            type="number" min="1" step="1" id="cashValue" />
                    </InputGroup>

                    <label htmlFor="date" className="ms-3">Date: </label>
                    <input type="date" defaultValue={today.toISOString().substring(0, 10)}
                        id="dateValue" name="date" className="m-3"></input>

                    <InputGroup>
                        <InputGroup.Text id="Note">
                            Note
                        </InputGroup.Text>
                        <Form.Control id="noteValue"
                            aria-label="Default"
                            aria-describedby="inputGroup-sizing-default"
                        />
                    </InputGroup>

                    <br />
                    <Button variant="outline-primary" type="submit"
                        onClick={
                            handleSubmit
                        }
                        className="submit-button ms-3 rounded-5">
                        Submit
                    </Button>
                    <Link to="/history" variant="success" type="button"
                        className="btn bg-success text-white button">
                        History
                    </Link>
                </Form>
            </div>
        </div>

    )
}

export default FormBody;
