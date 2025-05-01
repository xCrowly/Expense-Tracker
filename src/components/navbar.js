import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../translations";
import {
  Settings,
  History,
  LayoutDashboard,
  LogOut,
  Globe,
  UserCog,
} from "lucide-react";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [homeBtnHide, sethomeBtnHide] = useState(true);
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      return sethomeBtnHide(false);
    }
  }, [location.pathname]);

  function getName() {
    const email = localStorage.getItem("email");
    return email ? email.split("@")[0] : "";
  }

  function signOut() {
    // Clear all authentication related items
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("data");
    localStorage.removeItem("targetSpending");

    // Clear settings related items
    localStorage.removeItem("cashValues");
    localStorage.removeItem("quickNotes");
    localStorage.removeItem("language");

    window.location.href = "/";
  }

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    changeLanguage(newLang);
    window.location.reload();
  };

  return (
    <Navbar className="navbar-styling mb-3 p-3 shadow" sticky="top">
      <Container>
        <Link
          className="nav-title me-0 text-primary fs-5 fw-bold text-decoration-none"
          to="/home"
        >
          {t("expenseTracker")}
        </Link>
        <div className="d-flex align-items-center ">
          {!homeBtnHide && (
            <>
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-basic"
                  className="text-decoration-none text-secondary d-flex align-items-center gap-2"
                >
                  <UserCog size={20} className="text-success"/>
                  <i>{getName()}</i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => navigate("/settings")}
                    className="d-flex align-items-center gap-2"
                  >
                    <Settings size={16} />
                    {t("settings")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => navigate("/history")}
                    className="d-flex align-items-center gap-2"
                  >
                    <History size={16} />
                    {t("history")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => navigate("/dashboard")}
                    className="d-flex align-items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    {t("dashboard")}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={signOut}
                    className="text-danger d-flex align-items-center gap-2"
                  >
                    <LogOut size={16} />
                    {t("signOut")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={toggleLanguage}
                className="me-3 d-flex align-items-center gap-2"
              >
                <Globe size={16} />
                {language === "en" ? "العربية" : "English"}
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default NavBar;
