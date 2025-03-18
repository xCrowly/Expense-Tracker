import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error from "./components/Error";
import Footer from "./components/footer";
import FormBody from "./components/form";
import History from "./components/history";
import NavBar from "./components/navbar";
import SignupPage from "./components/signup-login";
import Dashboard from "./components/Dashboard"; // Import the new Dashboard component

function App() {
  return (
    // Adding routes using react-routerF
    <BrowserRouter router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <SignupPage />
              <Footer />
            </div>
          }
        />

        <Route
          path="/home"
          element={
            <div>
              <FormBody />
              <Footer />
            </div>
          }
        />

        <Route
          path="/history"
          element={
            <div>
              <History />
              <Footer />
            </div>
          }
        />

        <Route
          path="/dashboard"
          element={
            <div>
              <Dashboard />
              <Footer />
            </div>
          }
        />

        <Route
          path="*"
          element={
            <div>
              <Error />
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
