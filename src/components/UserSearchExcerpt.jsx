import React from "react";
import { trimName } from "../utils";
import "./styles/UserSearchExcerpt.css";

const UserSearchExcerpt = ({ user, onSelect }) => {
  return (
    <div className="userSearchExcerpt__container">
      <div className="user">
        <div className="user__avatar">{trimName(user.name)}</div>
        <div>{user.email}</div>
      </div>
    </div>
  );
};

export default UserSearchExcerpt;
