import toast from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import "./styles/Search.css";

import uparrow from "../assets/svg/up-arrow.svg";
import downarrow from "../assets/svg/down-arrow.svg";
import Loading from "./Loading";

import UserSearchExcerpt from "./UserSearchExcerpt";
import { searchUser } from "../utils/axiosRequest";

const Search = ({ setUser, task = null, data, btnText }) => {
  const [search, setSearch] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [searchUserResults, setSearchUserResults] = useState([]);
  const lastSearchRef = useRef("");

  const toggleButtonRef = useRef(null);
  const userListRef = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (
      userListRef.current &&
      !userListRef.current.contains(event.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target)
    ) {
      setShowUserList(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!search) {
        setSearchUserResults([]);
        setShowUserList(false);
        return;
      }

      if (lastSearchRef.current === search) return;

      lastSearchRef.current = search;
      setLoadingUser(true);
      setShowUserList(true);
      try {
        const { success, data, message } = await searchUser(search);

        if (success) {
          setSearchUserResults(data);
        } else {
          toast.error(message);
        }
      } finally {
        setLoadingUser(false);
      }
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleSelect = (user) => {
    if (user.email !== lastSearchRef.current) {
      setUser(user);
      setSearchUserResults([]);
      setSearch(user.email);
    }
  };

  const isDisabled = (user) => {
    return (
      task?.assignTo?.includes(user._id) ||
      data.assignTo === user._id ||
      user.email === data?.email
    );
  };

  return (
    <div className="search__input__container">
      <input
        value={search}
        onChange={(e) => {
          if (e.target.value.trim() === "") {
            setUser("");
          }
          setSearch(e.target.value);
        }}
        className="search__input"
        type="email"
        placeholder="Enter the email"
      />

      {search && (
        <button
          ref={toggleButtonRef}
          title="show/hide userlist"
          onClick={() => {
            setShowUserList(!showUserList);
          }}
        >
          <img src={!showUserList ? downarrow : uparrow} alt="show userlist" />
        </button>
      )}

      {showUserList && (
        <div ref={userListRef} className="search__list__container">
          {searchUserResults.length === 0 && !loadingUser && !!search && (
            <p style={{ padding: "4px" }}>No user found!</p>
          )}
          {loadingUser && (
            <span>
              <Loading />
            </span>
          )}{" "}
          {searchUserResults.length > 0 &&
            !loadingUser &&
            searchUserResults.map((user) => (
              <div key={user._id} className="search__list__item">
                <div className="search__list__item__avatar">
                  <UserSearchExcerpt user={user} />
                </div>
                <div className="search__list__item__buttons">
                  <button
                    disabled={isDisabled(user)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(user);
                    }}
                  >
                    {btnText}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default Search;
