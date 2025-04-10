import React from "react";
import { Link } from "react-router-dom";

function Error() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center error-page">
      <div className="text-white text-center mt-0">
        <h4>404 page not found</h4>
      </div>
      <div>
        <Link to="/home" className="btn bg-white text-danger">
          Home
        </Link>
      </div>
    </div>
  );
}

export default Error;
