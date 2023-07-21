import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Error from "./components/Error";
import Footer from './components/footer';
import FormBody from "./components/form";
import History from "./components/history";
import NavBar from "./components/navbar";
import SignupPage from "./components/signup-login";

function App() {
    return (
        // Adding routes using react-router
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
                        <Footer />
                    </div>
                } />

                <Route path='history' element={
                    <div>
                        <History />
                        <Footer />
                    </div>
                } />

                <Route path='*' element={
                    <div>
                        <Error />
                        <Footer />
                    </div>
                } />

            </Routes>
        </BrowserRouter>
    )
}

export default App;