import { useDispatch, useSelector } from "react-redux";
import "./styles/AddPeople.css";
import { useState } from "react";
import { addPeople } from "../features/task/taskSlice";

const AddPeople = ({ setShow }) => {
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const { loading } = useSelector((state) => state.task);
  const [success, setSuccess] = useState(false);
  const handleAddPeople = async (userEmail) => {
    const isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail || !isemail.test(userEmail)) {
      return toast.error("Please enter a valid email");
    }
    setSuccess(false);
    const result = await dispatch(addPeople({ userEmail }));

    if (result.type === "task/addPeople/fulfilled") {
      setSuccess(true);
    }
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

            <input
              onChange={(e) => setUserEmail(e.target.value)}
              className="add-people__container__input"
              type="email"
              placeholder="Enter the email"
            />

            <div className="add-people__container__buttons">
              <button
                onClick={() => setShow(false)}
                className="add-people__container__buttons__cancel"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={() => handleAddPeople(userEmail)}
                className="add-people__container__buttons__add"
              >
                Add Email
              </button>
            </div>
          </>
        ) : (
          <div className="add-people__success ">
            {userEmail} added to Board
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
