import { React, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Link } from "react-router-dom";
import addUserData from './firebase/addUserData';
import getUserData from "./firebase/getUserData";
import SettingsModal from "./SettingsModal"; // Import the SettingsModal component

function FormBody() {
    const [cash, setCash] = useState('');
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [note, setNote] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Load saved values from localStorage
    const [cashValues, setCashValues] = useState([]);
    const [quickNotes, setQuickNotes] = useState([]);


    useEffect(() => {

        const savedCashValues = JSON.parse(localStorage.getItem("cashValues")) || [1, 2, 5, 10, 20, 50];
        const savedQuickNotes = JSON.parse(localStorage.getItem("quickNotes")) || ["Groceries", "Transport", "Entertainment", "Utilities", "Rent", "Shopping"];
        setCashValues(savedCashValues);
        setQuickNotes(savedQuickNotes);
    }, []);

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
        <div id="form-body" className="px-3 mb-5">
            <div className="pb-3">
                <div className="d-flex justify-content-center text-white fs-4">
                    <b>Hello, <i>{getName()}</i></b>
                </div>
            </div>

            <div className="form-size bg-light rounded-1 shadow rounded-4">
                <Form onSubmit={handleSubmit}>
                    <Form.Label>Expenses</Form.Label>
                    <div className="messages text-danger">
                        {errorMessage()}
                    </div>
                    <InputGroup>
                        <InputGroup.Text className="bg-success text-white">$</InputGroup.Text>
                        <Form.Control
                            value={cash}
                            onChange={(e) => setCash(e.target.value)}
                            type="number"
                            min="1"
                            step="1"
                            id="cashValue"
                        />
                    </InputGroup>

                    {/* Cash Buttons */}
                    <div className="mb-3">
                        <p className="mb-2">Quick Cash:</p>
                        <div className="d-flex flex-wrap gap-2">
                            {cashValues.map((amount) => (
                                <Button
                                    key={amount}
                                    variant="outline-secondary"
                                    onClick={() => setCash(amount)}
                                >
                                    ${amount}
                                </Button>
                            ))}
                        </div>
                    </div>

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
                        <InputGroup.Text id="Note" className="bg-warning text-dark">Note</InputGroup.Text>
                        <Form.Control
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            id="noteValue"
                        />
                    </InputGroup>

                    {/* Quick Notes Buttons */}
                    <div className="mb-3">
                        <p className="mb-2">Quick Notes:</p>
                        <div className="d-flex flex-wrap gap-2">
                            {quickNotes.map((text) => (
                                <Button
                                    key={text}
                                    variant="outline-primary"
                                    onClick={() => setNote(text)}
                                >
                                    {text}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <br />
                    <Button variant="secondary" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Link to="/history" className="btn bg-success text-white button ms-2 float-end">
                        History
                    </Link>
                    <Button variant="dark" onClick={() => setShowSettings(true)} className="float-end">
                        Settings
                    </Button>
                </Form>
                {/* Settings Modal */}
                <SettingsModal
                    show={showSettings}
                    handleClose={() => setShowSettings(false)}
                    cashValues={cashValues}
                    setCashValues={setCashValues}
                    quickNotes={quickNotes}
                    setQuickNotes={setQuickNotes}
                />
            </div>
        </div>
    );
}

export default FormBody;