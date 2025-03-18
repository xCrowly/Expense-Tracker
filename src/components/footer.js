import React from "react";

function Footer() {
  return (
    <footer id="my-footer">
      <div className="footer-text">
        <div>
          This website is made with{" "}
          <strong>
            HTML, CSS, JavaScript, Bootstrap, Sass, React, React Router,
          </strong>{" "}
          and <strong>Firebase</strong> (Authentication & Realtime Database).
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
