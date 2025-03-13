import { React, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from "react-router-dom";
import addUserData from './firebase/addUserData';
import getUserData from "./firebase/getUserData";

function FormBody() {
    const [cash, setCash] = useState('');
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [note, setNote] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && window.location.pathname === "/home") {
            window.location.href = '/';
        }
    }, []);

    const getName = () => {
        const email = localStorage.getItem('email');
        return email ? email.split('@')[0] : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cash || !date) {
            setError(true);
            return;
        }
        setLoading(true);
        try {
            await addUserData(localStorage.getItem('id'), Math.floor(cash), date, note);
            await getUserData(localStorage.getItem('id'));
        } catch (err) {
            console.error("Error submitting data:", err);
        } finally {
            setLoading(false);
            setCash('');
            setNote('');
        }
    };

    const errorMessage = () => (
        <div className="error" style={{ display: error ? '' : 'none' }}>
            <h4>Please enter cash</h4>
        </div>
    );

    return (
        <div id="form-body" className="px-3">
            <div className="pb-3">
                <div className="d-flex justify-content-center">
                    <b>Hello, <i className="text-white">{getName()}</i></b>
                </div>
            </div>

            <div className="form-size bg-light rounded-1 shadow rounded-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Label>Expenses</Form.Label>
                    <div className="messages text-danger">
                        {errorMessage()}
                    </div>
                    <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                            value={cash}
                            onChange={(e) => setCash(e.target.value)}
                            type="number"
                            min="1"
                            step="1"
                            id="cashValue"
                        />
                    </InputGroup>

                    <label htmlFor="date" className="ms-3">Date: </label>
                    <input
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        type="date"
                        id="dateValue"
                        name="date"
                        className="m-3"
                    />

                    <InputGroup>
                        <InputGroup.Text id="Note">Note</InputGroup.Text>
                        <Form.Control
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            id="noteValue"
                        />
                    </InputGroup>

                    <br />
                    <Button variant="outline-primary" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Link to="/history" className="btn bg-success text-white button ms-2">
                        History
                    </Link>
                </Form>
            </div>
        </div>
    );
}

export default FormBody;