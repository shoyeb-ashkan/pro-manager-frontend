import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import "./stylesheets/Dashboard.css";
import { formatLocalDate } from "../utils";

import people from "../assets/svg/people.svg";

import {
  backToDefault,
  createTask,
  deleteTask,
  setTaskRange,
  updateTask,
} from "../features/task/taskSlice";
import AddEditTask from "./../components/AddEditTask";
import Delete from "../components/LogoutDelete";
import AddPeople from "../components/AddPeople";
import Loading from "../components/Loading";
import TaskSection from "../components/TaskSection";

const Dashboard = () => {
  const { user, loading: loadingUser } = useSelector((state) => state.user);
  const { taskRange, error, success, loading } = useSelector(
    (state) => state.task
  );

  const [showAddPeople, setShowAddPeople] = useState(false);
  const [isAddEditTaskShown, setIsAddEditTaskShown] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [task, setTask] = useState({});
  const [mode, setMode] = useState("create");

  const dispatch = useDispatch();
  // console.log(selectedRange);
  const handleCreateEditTaskSubmit = async (data) => {
    if (mode === "create") {
      await dispatch(createTask(data));
    } else {
      await dispatch(updateTask({ taskId: task._id, formData: { ...data } }));
    }
  };

  useEffect(() => {
    if (!loading) {
      if (success) {
        toast.success(success);
        setIsAddEditTaskShown(false);
        setTask({});
        setShowDeleteTask(false);
      }
      if (error) toast.error(error);
      dispatch(backToDefault());
    }
  }, [loading, success, error]);

  const handleOptionChange = (e) => {
    e.preventDefault();
    dispatch(setTaskRange(e.target.value));
  };

  const cancleTaskEdit = () => {
    setTask({});
    setMode("create");
    setIsAddEditTaskShown(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

  // console.log("Current tasks:", tasks);
  return (
    <div className="dashboard__container">
      <div className=" dashboard__header">
        <div className="dashboard__header__top">
          <span className="dashboard__header__top__name">
            Welcome!{" "}
            <span className="dashboard__loading">
              {loadingUser ? <Loading /> : user?.name}
            </span>
          </span>{" "}
          <span className="dashboad__header__date">{formatLocalDate()}</span>
        </div>
        <div className="dashboard__header__bottom">
          <div className="dashboard__header__bottom__left">
            <span>Board</span>
            <button onClick={() => setShowAddPeople(true)}>
              <img src={people} alt="people" />
              Add People
            </button>
          </div>
          <div className="dashboard__header__bottom__right">
            <select onChange={handleOptionChange} value={taskRange}>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard__main">
        <TaskSection
          setIsAddEditTaskShown={setIsAddEditTaskShown}
          setMode={setMode}
          setTask={setTask}
          setShowDeleteTask={setShowDeleteTask}
        />
      </div>
      {isAddEditTaskShown && (
        <AddEditTask
          mode={mode}
          onsubmit={handleCreateEditTaskSubmit}
          setIsShown={cancleTaskEdit}
          task={task}
        />
      )}

      {showDeleteTask && (
        <Delete
          loading={loading}
          handleSubmit={handleDelete}
          type="Delete"
          setShow={setShowDeleteTask}
        />
      )}

      {showAddPeople && <AddPeople setShow={setShowAddPeople} />}
    </div>
  );
};
export default Dashboard;
