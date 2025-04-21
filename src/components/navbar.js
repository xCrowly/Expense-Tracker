import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function NavBar() {
  // check the current location of the userx
  const location = useLocation();

  // check if the user has signed in in order to show these buttons
  const [homeBtnHide, sethomeBtnHide] = useState(true);

  // check if the user has signed in in order to show these buttons
  useEffect(() => {
    if (localStorage.getItem("token")) {
      return sethomeBtnHide(false);
    }
  }, [location.pathname]);

  // delete user data from local storage
  function signOut() {
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    localStorage.removeItem("targetSpending");
    window.location.href = "/";
  }

  return (
    <Navbar className="navbar-styling mb-3 p-3 shadow" sticky="top">
      <Container>
        <Link
          className="nav-title me-0 text-primary fs-5 fw-bold text-decoration-none"
          to="/home"
        >
          Expense Tracker
        </Link>
        <div>
          <Link
            hidden={homeBtnHide ? true : false}
            to="/home"
            variant="secondary"
            type="button"
            className="btn home-btn bg-secondary text-white me-2 flex-shrink-0"
          >
            Home
          </Link>
          <Button
            hidden={homeBtnHide ? true : false}
            onClick={signOut}
            variant="black"
            className="home-btn  rounded-5"
          >
            Sign out
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavBar;
