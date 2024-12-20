import { useMemo } from "react";
import "./stylesheets/Analytics.css";
import { useSelector } from "react-redux";
import AnalyticsLoader from "../components/AnalyticsLoader";

const Analytics = () => {
  const { tasks, loading } = useSelector((state) => state.task);

  const analytics = useMemo(
    () => ({
      tasks: {
        "Backlog Tasks": tasks.filter((task) => task.status === "backlog")
          .length,
        "In-Progress Tasks": tasks.filter(
          (task) => task.status === "in-progress"
        ).length,
        "To-do Tasks": tasks.filter((task) => task.status === "to-do").length,
        "Done Tasks": tasks.filter((task) => task.status === "done").length,
      },
      priority: {
        "Low Priority": tasks.filter((task) => task.priority === "low").length,
        "Medium Priority": tasks.filter((task) => task.priority === "moderate")
          .length,
        "High Priority": tasks.filter((task) => task.priority === "high")
          .length,
        "Due Date Tasks": tasks.filter((task) => !task.dueDate).length,
      },
    }),
    [tasks]
  );

  return (
    <div className="analytics__container">
      <div className="analytics__container__header">Analytics</div>

      <div className="analytics__main">
        {Object.keys(analytics).map((key) => {
          return (
            <div key={key} className="analytics__main__section">
              {Object.keys(analytics[key]).map((item) => {
                return (
                  <div className="analytics__main__item__container" key={item}>
                    {loading ? (
                      <AnalyticsLoader />
                    ) : (
                      <>
                        <div className="analytics__main__item">
                          {" "}
                          <div className="analytics__main__item__color" />
                          {item}
                        </div>
                        <span>
                          {String(analytics[key][item]).padStart(2, "0")}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Analytics;
