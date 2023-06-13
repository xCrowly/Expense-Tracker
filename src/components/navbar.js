import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
    return (
        <Navbar bg="light" className="mb-3">
            <Container>
                <Navbar.Brand className="mx-auto fw-bold">Expense tracker</Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default NavBar;