import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

function NavBar() {

    // check if the user has signed in in order to show these buttons
    const [homeBtnHide, sethomeBtnHide] = useState(true);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            return sethomeBtnHide(prev => !prev)
        }
    }, [])

    // delete user data from local storage
    function signOut() {
        localStorage.removeItem('id');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        localStorage.removeItem('data');
        window.location.href = '/'
    }

    return (
        <Navbar className="navbar-styling mb-3 p-1 shadow" sticky="top">
            <Container>
                <Navbar.Brand className="nav-title me-0 text-primary fw-bold">
                    Expense tracker
                </Navbar.Brand>
                <div>
                    <Link hidden={homeBtnHide ? true : false} to="/home" variant="success" type="button"
                        className="btn home-btn bg-success text-white me-2 flex-shrink-0">
                        Home
                    </Link>
                    <Button hidden={homeBtnHide ? true : false} onClick={signOut}
                        variant="outline-danger" className="home-btn  rounded-5" >
                        Sign out
                    </Button>
                </div>
            </Container>
        </Navbar >
    )
}

export default NavBar;