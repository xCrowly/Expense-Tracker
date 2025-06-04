import React from "react";
import { Github, Linkedin, Globe } from "lucide-react";

function Footer() {
  const iconStyle = {
    transition: "transform 0.3s ease"
  };
  
  const footerStyle = {
    marginBottom: "20px"
  };
  
  return (
    <footer id="my-footer" className="bg-light text-dark py-3 mt-4" style={footerStyle}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
          <a 
            href="https://ahmedeissa1.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-none text-dark footer-link"
          >
            <Globe size={20} className="me-2 footer-icon" style={iconStyle} />
            <span>Portfolio</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/ahmed-badawy-61bb7a213/"
            target="_blank" 
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-none text-dark footer-link"
          >
            <Linkedin size={20} className="me-2 footer-icon" style={iconStyle} />
            <span>LinkedIn</span>
          </a>
          <a 
            href="https://github.com/xCrowly" 
            target="_blank" 
            rel="noopener noreferrer"
            className="d-flex align-items-center text-decoration-none text-dark footer-link"
          >
            <Github size={20} className="me-2 footer-icon" style={iconStyle} />
            <span>GitHub</span>
          </a>
        </div>
        <div className="text-center mt-2">
          <small>&copy; {new Date().getFullYear()} Ahmed Eissa. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
