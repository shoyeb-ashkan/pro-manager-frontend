import codesandbox from "../assets/svg/codesandbox.svg";
import "./stylesheets/TaskOverview.css";
import { formatLocalDate, priorities } from "./../utils/index";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import { getTask } from "../utils/axiosRequest";
import Loading from "./../components/Loading";

const TaskOverview = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { success, data, message } = await getTask(taskId);

        if (success) {
          setTask(data);
        } else {
          toast.error(message);
          navigate("/404");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalChecklistItems = task ? task?.checklist?.length : 0;
  const checkedItemsCount = task
    ? task?.checklist?.filter((item) => item.checked)?.length
    : 0;
  const priority =
    task && priorities.find((priority) => priority.value === task.priority);

  console.log(task.dueDate);

  return (
    <div className="task-overview__container">
      <div className="task-overview__header">
        <img src={codesandbox} alt="logo" />
        <span>Pro Manager</span>
      </div>

      <div className="task-overview__main">
        {loading ? (
          <Loading />
        ) : (
          <div className="task-overview__main__container">
            <div className="task-overview__main__container__priority">
              <div
                className="task-overview__main__priority__color"
                style={{ backgroundColor: priority?.color }}
              />
              {priority?.name}
            </div>
            <div className="task-overview__main__header">{task.title}</div>

            <div className="task-overview__main__checklist">
              <div className="task-overview__main__checklist__header">
                <label>
                  Checklist{" "}
                  <span>{`(${checkedItemsCount}/${totalChecklistItems})`}</span>
                </label>
              </div>

              <div className="task-overview__main__checklist__items">
                <div className="taskExcerpt__checklist__items">
                  {task?.checklist?.map((item) => {
                    return (
                      <div
                        key={`${item.itemId},${item.title}`}
                        className="taskExcerpt__checklist__item"
                      >
                        <input type="checkbox" checked={item.checked} />
                        <span>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {task?.dueDate && (
              <div className="task-overview__main__dueDate">
                Due Date
                <span>{formatLocalDate(task?.dueDate, " MMM dd")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskOverview;
