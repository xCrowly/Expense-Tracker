import React from "react";
import { Link } from "react-router-dom";

function Error() {
    return (
        <div>
            <div className=" d-flex justify-content-center align-content-center pt-3">
                <h4>404 page not found</h4>
            </div>
            <div className="d-flex justify-content-center align-content-center pt-3">
                <Link to="/home" className="btn bg-white text-danger"
                >Home</Link>
            </div>
        </div>
    )
}

export default Error;