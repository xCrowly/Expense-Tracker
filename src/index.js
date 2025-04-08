// eslint-disable-next-line no-unused-vars
import BootStrap from "bootstrap";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
import './assets/scss/styles.css';

// render the app using react-dom
const app = ReactDOM.createRoot(document.getElementById('main-body'));
app.render(
    <App />
);