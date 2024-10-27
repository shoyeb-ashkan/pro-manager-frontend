import { NavLink } from "react-router-dom";
import "./ProtectedRoute.css";
import codesandbox from "../assets/svg/codesandbox.svg";
import database from "../assets/svg/database.svg";
import layout from "../assets/svg/layout.svg";
import settings from "../assets/svg/settings.svg";
import logout from "../assets/svg/logout.svg";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import Logout from "../components/LogoutDelete";
import { useHandleLogout } from "../utils";
import { backToDefault, getTasks } from "../features/task/taskSlice";

const ProtectedRoute = ({ children }) => {
  const { taskRange } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const handleLogout = useHandleLogout();
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
    } else {
      dispatch(getUserDetails())
        .unwrap()
        .catch(() => {
          localStorage.removeItem("token");
          handleLogout();
        });
    }
  }, []);
  useEffect(() => {
    dispatch(getTasks(taskRange));
    dispatch(backToDefault());
  }, [taskRange]);

  return (
    <div className="protected-route">
      <section className="sidebar">
        <div className="app__logo">
          <img src={codesandbox} alt="logo" />
          <span>Pro Manager</span>
        </div>
        <div className="links__container">
          <div className="links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={layout} alt="layout" />
              Board
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={database} alt="database" />
              Analytics
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <img src={settings} alt="settings" />
              Settings
            </NavLink>
          </div>
          <button
            onClick={() => {
              setShowLogout(true);
            }}
          >
            <img src={logout} alt="logout" />
            Logout
          </button>

          <div className="created__by">
            Created By{" "}
            <a
              href="https://shoyeb-ashkan.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              Shoyeb Ashkan
            </a>
          </div>
        </div>
      </section>
      <section className="main__content">{children}</section>

      {showLogout && (
        <Logout
          handleSubmit={handleLogout}
          type="Logout"
          setShow={setShowLogout}
        />
      )}
    </div>
  );
};

export default ProtectedRoute;
