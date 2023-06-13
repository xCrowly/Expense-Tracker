// eslint-disable-next-line no-unused-vars
import BootStrap from "bootstrap";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App";
import './assets/scss/styles.css';
import reportWebVitals from './reportWebVitals';

const app = ReactDOM.createRoot(document.getElementById('nav-bar'));
app.render(
    <App />
);

reportWebVitals();