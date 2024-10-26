import "./styles/Form.css";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import eye from "../assets/svg/eye.svg";
import eyeOff from "../assets/svg/eye-hide.svg";
import React, { useState } from "react";
import profile from "../assets/svg/profile.svg";
import message from "../assets/svg/message.svg";
import lock from "../assets/svg/lock.svg";
const Form = ({
  formError,
  formFields,
  onSubmit,
  errorMessage,
  buttonText,
}) => {
  const inputIcons = {
    text: profile,
    email: message,
    password: lock,
  };
  const { loading, error } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((field, index) => (
        <div className="form-container" key={index}>
          <span className="input__container">
            <label htmlFor={field.name} className="input__icon">
              <img src={inputIcons[field.type]} alt={field.name} />
            </label>
            <input
              type={
                field.type === "password" && showPassword[field.name]
                  ? "text"
                  : field.type
              }
              id={field.name}
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              placeholder={field.placeholder}
            />

            {field.type === "password" && (
              <span className="input__icon__passowrd">
                {/* dont want user to use keyboard to show and hide password */}
                <img
                  onClick={() => togglePasswordVisibility(field.name)}
                  src={showPassword[field.name] ? eyeOff : eye}
                  alt="eye-icon"
                />
              </span>
            )}
          </span>
          <span className="error-msg">
            {formError[field.name] && errorMessage[field.name].message}
          </span>
        </div>
      ))}

      <button type="submit" disabled={loading}>
        {loading ? <Loading /> : buttonText}
      </button>
      <span className="error-msg">{error}</span>
    </form>
  );
};

export default Form;
