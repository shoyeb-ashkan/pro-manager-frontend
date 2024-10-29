import React, { useState } from "react";
import { formatLocalDate, priorities } from "../utils";
import "./styles/AddEditTask.css";
import deleteIcon from "../assets/svg/delete.svg";
import Loading from "./Loading";
import toast from "react-hot-toast";
import UserSearchExcerpt from "./UserSearchExcerpt";
import Calendar from "./Calendar";
import { useSelector } from "react-redux";
import Search from "./Search";

const AddEditTask = ({
  task = null,
  setIsShown,
  mode = "create",
  onsubmit,
}) => {
  const { loading } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState({
    title: task?.title || "",
    priority: task?.priority || "",
    assignTo: task?.assignTo || "",
    checklist: task?.checklist || [],
    dueDate: task?.dueDate || "",
  });

  const originalData = { ...task };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  const [formErrors, setFormErrors] = useState({
    title: false,
    priority: false,
    checklist: false,
    checklistIems: {},
  });

  const totalChecklistItems = data.checklist.length;
  const checkedItemsCount = data.checklist.filter(
    (item) => item.checked
  ).length;

  const handleSetAssignee = (user) => {
    setData((prev) => ({ ...prev, assignTo: user._id }));
  };

  const handleAddNewItem = () => {
    setData((prev) => ({
      ...prev,
      checklist: [
        ...prev.checklist,
        { itemId: generateUniqueId(), text: "", checked: false },
      ],
    }));
  };
  const handleDateChange = (date) => {
    if (date) {
      setData((prev) => ({
        ...prev,
        dueDate: formatLocalDate(date, "yyyy-MM-dd"),
      }));
      setShowDatePicker(false);
    } else {
      setData((prev) => ({ ...prev, dueDate: "" }));
    }
  };
  const handleCheckboxChange = (id) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.itemId === id ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const handleDeleteItem = (id) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((item) => item.itemId !== id),
    }));
  };

  const handleTextChange = (id, value) => {
    setData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.itemId === id ? { ...item, text: value } : item
      ),
    }));
  };

  //validate fields
  const validatedata = () => {
    const newErrors = {
      title: !data.title,
      priority: !data.priority,
      checklist: totalChecklistItems === 0,
      checklistIems: {},
    };

    let showRequiredFieldToast = false;
    let showChecklistItemError = false;

    if (newErrors.title || newErrors.priority || newErrors.checklist) {
      showRequiredFieldToast = true;
    }

    if (!showRequiredFieldToast) {
      data.checklist.forEach((item) => {
        newErrors.checklistIems[item.itemId] = !item.text;
        if (!item?.text.trim()) {
          showChecklistItemError = true;
        }
      });
    }

    if (showRequiredFieldToast) {
      toast.error("* marked fields are required");
    }

    if (showChecklistItemError) {
      toast.error("Checklist items must have a title.");
    }

    setFormErrors(newErrors);
    return !(showRequiredFieldToast || showChecklistItemError);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (validatedata()) {
      const submissionData =
        mode === "create"
          ? data
          : Object.keys(data).reduce((acc, key) => {
              if (data[key] !== originalData[key]) {
                acc[key] = data[key];
              }
              return acc;
            }, {});

      if (JSON.stringify(submissionData) !== "{}") {
        onsubmit(submissionData);
      } else {
        toast("⚠️ Please make some changes first!", {
          style: {
            background: "#FFFACD",
            color: "#333",
          },
        });
      }
    }
  };
  return (
    <div className="add-edit__container">
      <div className="add-edit__box">
        <div className="add-edit__box__title">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            name="title"
            className={formErrors.title ? "task__error" : ""}
            id="title"
            type="text"
            placeholder="Enter Task Title"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="add-edit__box__priority">
          <label>
            Priority <span className="required">*</span>
          </label>
          <div className="add-edit__priority__button__container">
            {priorities.map((priority) => (
              <button
                key={priority.value}
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    priority: priority.value,
                  }))
                }
                style={
                  priority.value === data.priority
                    ? { background: "#EEECEC" }
                    : {}
                }
                className="add-edit__priority__button"
              >
                <div
                  className="add-edit__priority__color"
                  style={{ backgroundColor: priority.color }}
                ></div>
                {priority.name}
              </button>
            ))}
          </div>
        </div>

        <div className="add-edit__box__assignee">
          <label>Assign to</label>
          {!!task &&
          (task?.assignTo?.includes(user._id) ||
            !task?.createdBy === user._id) ? (
            <UserSearchExcerpt user={user} />
          ) : (
            <div className="add-edit__box__assignee__container">
              <Search setUser={handleSetAssignee} task={task} data={data} />
            </div>
          )}
        </div>

        <div className="add-edit__box__checklist">
          <label>
            Checklist{" "}
            <span>{`(${checkedItemsCount}/${totalChecklistItems})`}</span>
            <span className="required">*</span>
          </label>
          <div className="add-edit__box__checklist__container">
            <div className="checklist__items">
              {data.checklist.map((item) => (
                <div className="checklist__item" key={item.itemId}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.itemId)}
                  />
                  <input
                    className={
                      formErrors.checklistIems[item.itemId] ? "task__error" : ""
                    }
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleTextChange(item.itemId, e.target.value)
                    }
                    placeholder="Add a task"
                  />
                  <button
                    onClick={() => handleDeleteItem(item.itemId)}
                    className="delete__icon"
                  >
                    <img src={deleteIcon} alt="delete-icon" />
                  </button>
                </div>
              ))}
              <button onClick={handleAddNewItem}>+ Add New</button>
            </div>
          </div>
        </div>

        <div className="add-edit__box__bottom">
          {showDatePicker && (
            <Calendar selectedDate={data.dueDate} onChange={handleDateChange} />
          )}
          <button
            className="add-edit__bottom__dueDate"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            {data.dueDate
              ? `${formatLocalDate(data.dueDate, "MM/dd/yyyy")}`
              : "Select Due Date"}
          </button>

          <div className="add-edit__bottom__button">
            <button
              className="add-edit__bottom__button__cancel"
              onClick={() => setIsShown(false)}
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={(e) => {
                handleSubmitForm(e);
              }}
              className="add-edit__bottom__button__save"
            >
              {loading ? <Loading /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTask;
