import { useDispatch, useSelector } from "react-redux";
import "./styles/AddPeople.css";
import { useState } from "react";
import { addPeople } from "../features/task/taskSlice";
import toast from "react-hot-toast";
import Search from "./Search";
import Loading from "./Loading";

const AddPeople = ({ setShow }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const { loading } = useSelector((state) => state.task);
  const [success, setSuccess] = useState(false);

  const handleAddPeople = async (user) => {
    const isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user || !isemail.test(user.email)) {
      return toast.error("Please enter a valid email");
    }
    setSuccess(false);
    const result = await dispatch(addPeople(user));

    if (result.type === "task/addPeople/fulfilled") {
      setSuccess(true);
    }
  };

  const handleSetUser = (user) => {
    setUser(user);
  };

  return (
    <div className="add-people">
      {/* {!loading && ( */}
      <div className="add-people__container">
        {!success ? (
          <>
            <div className="add-people__container__header">
              Add people to the board
            </div>
            <div className="add-people__input__container">
              <Search setUser={handleSetUser} data={user} />
            </div>
            <div className="add-people__container__buttons">
              <button
                onClick={() => setShow(false)}
                className="add-people__container__buttons__cancel"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleAddPeople(user)}
                className="add-people__container__buttons__add"
              >
                {loading ? <Loading /> : "Add Email"}
              </button>
            </div>
          </>
        ) : (
          <div className="add-people__success ">
            {user.email} added to Board
            <div className="add-people__container__buttons">
              <button
                onClick={() => setShow(false)}
                className=" add-people__container__buttons__add"
              >
                {" "}
                Okay, got it!
              </button>
            </div>
          </div>
        )}
      </div>
      {/* )} */}
    </div>
  );
};
export default AddPeople;
