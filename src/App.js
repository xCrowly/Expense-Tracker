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
        <div className="App app-container body-bg">
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="main-content">
                    <SignupPage />
                  </div>
                  <Footer />
                </>
              }
            />

            <Route
              path="/home"
              element={
                <>
                  <div className="main-content">
                    <HomePageForm />
                  </div>
                  <Footer />
                </>
              }
            />

            <Route
              path="/history"
              element={
                <>
                  <div className="main-content">
                    <History />
                  </div>
                  <Footer />
                </>
              }
            />

            <Route
              path="/income-history"
              element={
                <>
                  <div className="main-content">
                    <IncomeHistory />
                  </div>
                  <Footer />
                </>
              }
            />

            <Route
              path="/dashboard"
              element={
                <>
                  <div className="main-content">
                    <Dashboard />
                  </div>
                  <Footer />
                </>
              }
            />

            <Route
              path="/settings"
              element={
                <>
                  <div className="main-content">
                    <Settings />
                  </div>
                  <Footer />
                </>
              }
            />

            <Route
              path="*"
              element={
                <>
                  <div className="main-content">
                    <Error />
                  </div>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
