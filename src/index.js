// eslint-disable-next-line no-unused-vars
import BootStrap from "bootstrap";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/scss/styles.css';
import FormBody from "./components/form";
import NavBar from "./components/navbar";
import reportWebVitals from './reportWebVitals';

const navbar = ReactDOM.createRoot(document.getElementById('nav-bar'));
navbar.render(
    <NavBar />
);

const formBody = ReactDOM.createRoot(document.getElementById('form-body'));
formBody.render(
    <FormBody />
);








reportWebVitals();