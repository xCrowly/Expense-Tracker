// eslint-disable-next-line no-unused-vars
import BootStrap from "bootstrap";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/scss/styles.css';
import FormBody from "./components/form";
import History from "./components/history";
import NavBar from "./components/navbar";
import SignupPage from "./components/signup-login";
import reportWebVitals from './reportWebVitals';

const navbar = ReactDOM.createRoot(document.getElementById('nav-bar'));
navbar.render(
    <NavBar />
);

const loginSignup = ReactDOM.createRoot(document.getElementById('login-page'));
loginSignup.render(
    <div >
        <SignupPage />
    </div>
);

const formBody = ReactDOM.createRoot(document.getElementById('form-body'));
formBody.render(
    <div >
        <FormBody />
    </div>
);

const history = ReactDOM.createRoot(document.getElementById('history'));
history.render(
    <div >
        <History />
    </div>
);




reportWebVitals();