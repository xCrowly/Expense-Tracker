import React from 'react';
// import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Error from "./components/Error";
import FormBody from "./components/form";
import History from "./components/history";
import NavBar from "./components/navbar";
import SignupPage from "./components/signup-login";

function App() {
    return (
        <BrowserRouter router>
            <NavBar />
            <Routes>

                <Route path='/' element={
                    <div>
                        <SignupPage />
                    </div>
                } />

                <Route path='home' element={
                    <div>
                        <FormBody />
                    </div>
                } />

                <Route path='history' element={
                    <div>
                        <History />
                    </div>
                } />

                <Route path='*' element={
                    <div>
                        <Error />
                    </div>
                } />

            </Routes>
        </BrowserRouter>
    )
}

export default App;