import "./AuthLayout.css";
import Art from "../assets/Art.png";
import { Navigate } from "react-router";
const AuthLayout = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  if (!!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="AuthLayout">
      <div className="side-content">
        <div className="image-container">
          <span className="background-circle" />
          <img src={Art} alt="logo" />
        </div>
        <p>Welcome aboard my friend</p>
        <span>just a couple of clicks and we start</span>
      </div>
      <div className="main-layout">{children}</div>
    </div>
  );
};
export default AuthLayout;
