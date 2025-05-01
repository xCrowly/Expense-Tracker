import React from "react";

function Footer() {
  return (
    <footer id="my-footer">
      <div className="footer-text">
        <div rel="preload">
          This website is made with HTML, CSS, JavaScript, Bootstrap, Sass,
          React, React Router, and Firebase (Authentication & Realtime
          Database).
        </div>
        <a
          href="https://ahmedbadawy.netlify.app"
          target="_blank"
          rel="noreferrer"
        >
          My portfolio here
        </a>
      </div>
    </footer>
  );
}

export default Footer;
