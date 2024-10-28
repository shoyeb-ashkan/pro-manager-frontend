import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./stylesheets/Dashboard.css";
import { formatLocalDate, sections } from "../utils";

import people from "../assets/svg/people.svg";
import collapse from "../assets/svg/collapse-all.svg";
import addTask from "../assets/svg/addTask.svg";

import {
  backToDefault,
  createTask,
  deleteTask,
  setTaskRange,
  updateTask,
} from "../features/task/taskSlice";
import AddEditTask from "./../components/AddEditTask";
import TaskExcerpt from "../components/TaskExcerpt";
import toast from "react-hot-toast";
import Delete from "../components/LogoutDelete";
import AddPeople from "../components/AddPeople";
import Loading from "../components/Loading";

const Dashboard = () => {
  const { user, loading: loadingUser } = useSelector((state) => state.user);
  const { taskRange, tasks, error, success, loading } = useSelector(
    (state) => state.task
  );

  const [collapseAll, setCollapseAll] = useState({
    backlog: false,
    "in-progress": false,
    "to-do": false,
    done: false,
  });
  const [showAddPeople, setShowAddPeople] = useState(false);
  const [isAddEditTaskShown, setIsAddEditTaskShown] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [task, setTask] = useState({});
  const [mode, setMode] = useState("create");

  const dispatch = useDispatch();
  // console.log(selectedRange);
  const onCreateEditTaskSubmit = async (data) => {
    if (mode === "create") {
      await dispatch(createTask(data));
    } else {
      await dispatch(updateTask({ taskId: task._id, formData: { ...data } }));
    }
  };

  const handleCollapseAll = (section) => {
    setCollapseAll((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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

  //getting sorted tasks from backed just adding final check
  const sortedTasks =
    tasks && [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // console.log("Current tasks:", tasks);
  return (
    <div className="dashboard__container">
      <div className=" dashboard__header">
        <div className="dashboard__header__top">
          <span className="dashboard__header__top__name">
            Welcome!{" "}
            <p className="dashboard__loading">
              {loadingUser ? <Loading /> : user && user?.name}
            </p>
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
        {sections.map((section) => (
          <div className="dashboard__section" key={section.name}>
            <div className="dashboard__section__header">
              <p>{section.name}</p>{" "}
              <div className="dashboard__section__header__buttons">
                {section.value === "to-do" && (
                  <button
                    title="add task"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAddEditTaskShown(true);
                    }}
                  >
                    <img src={addTask} alt="add-task" />
                  </button>
                )}
                <button
                  title="Collapse all"
                  onClick={() => handleCollapseAll(section.value)}
                >
                  <img src={collapse} alt="collapse" />
                </button>
              </div>
            </div>
            <div className="task__container">
              {sortedTasks &&
                sortedTasks.length > 0 &&
                sortedTasks
                  .filter((task) => task.status === section.value)
                  .map((task) => {
                    return (
                      <div key={task._id}>
                        <TaskExcerpt
                          task={task}
                          setMode={setMode}
                          setTask={setTask}
                          setIsAddEditTaskShown={setIsAddEditTaskShown}
                          collapseAll={collapseAll[section.value]}
                          setShowDeleteTask={setShowDeleteTask}
                        />
                      </div>
                    );
                  })}
            </div>
          </div>
        ))}
      </div>
      {isAddEditTaskShown && (
        <AddEditTask
          mode={mode}
          onsubmit={onCreateEditTaskSubmit}
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
