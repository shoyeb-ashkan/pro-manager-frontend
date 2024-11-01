import React from "react";
import "./stylesheets/NotFound.css";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="notfound-container">
      <div className="notfound-error">
        <h1 className="pulse">404</h1>
      </div>
      <p className="notfound-message">
        This page is not available — maybe it took a vacation!
      </p>
      <button className="notfound-home-button" onClick={() => navigate("/")}>
        Let's Find Our Way Home!
      </button>
    </div>
  );
};

export default NotFound;
