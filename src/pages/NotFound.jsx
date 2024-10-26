import React from "react";
import "./stylesheets/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
