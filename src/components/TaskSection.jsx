import { useState } from "react";
import { sections } from "../utils";
import "./styles/TaskSection.css";

import collapse from "../assets/svg/collapse-all.svg";
import addTask from "../assets/svg/addTask.svg";

import { useSelector } from "react-redux";
import TaskExcerpt from "./TaskExcerpt";
import CardLoading from "./CardLoading";

const TaskSection = ({
  setIsAddEditTaskShown,
  setMode,
  setTask,
  setShowDeleteTask,
}) => {
  const { loading, tasks } = useSelector((state) => state.task);
  const [collapseAll, setCollapseAll] = useState({
    backlog: false,
    "in-progress": false,
    "to-do": false,
    done: false,
  });

  const handleCollapseAll = (section) => {
    setCollapseAll((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  //getting sorted tasks from backed just adding final check
  const sortedTasks =
    tasks && [...tasks].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      {sections.map((section) => (
        <div className="section" key={section.name}>
          <div className="section__header">
            <p>{section.name}</p>{" "}
            <div className="section__header__buttons">
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
            {tasks?.length === 0 && loading && <CardLoading />}
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
    </>
  );
};
export default TaskSection;
