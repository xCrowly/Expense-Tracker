import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Error from "./components/Error";
import Footer from "./components/footer";
import HomePageForm from "./components/home";
import History from "./components/history";
import IncomeHistory from "./components/IncomeHistory";
import NavBar from "./components/navbar";
import SignupPage from "./components/signup-login";
import Dashboard from "./components/Dashboard";
import Settings from "./pages/Settings";
import { LanguageProvider } from "./context/LanguageContext";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
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
                  <HomePageForm />
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
              path="/income-history"
              element={
                <div>
                  <IncomeHistory />
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
              path="/settings"
              element={
                <div>
                  <Settings />
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
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
