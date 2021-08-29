import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useFormAndValidation } from "../utils/useFormAndValidation";

function AuthForm({ title, name, buttonText, onSubmit }) {
  const location = useLocation();
  const isLocationSignUp = location.pathname === "/sign-up";
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  React.useEffect(() => {
    resetForm();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="auth">
      <h2 className="auth__title">{title}</h2>

      <form
        className="auth__form"
        name={`auth-edit-${name}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <input
          type="email"
          name="email"
          value={values.email || ""}
          placeholder="Email"
          className={`auth__input ${errors.email ? "auth__input_error" : ""}`}
          minLength="2"
          maxLength="40"
          onChange={handleChange}
          required
        />
        <span
          className={`auth__input-error ${
            errors.email ? "auth__input-error_active" : ""
          }`}
        >
          {errors.email}
        </span>
        <input
          type="password"
          name="password"
          value={values.password || ""}
          placeholder="Пароль"
          className={`auth__input ${
            errors.password ? "auth__input_error" : ""
          }`}
          minLength="8"
          maxLength="40"
          onChange={handleChange}
          required
        />
        <span
          className={`auth__input-error ${
            errors.password ? "auth__input-error_active" : ""
          }`}
        >
          {errors.password}
        </span>
        {
          <button
            type="submit"
            className={`auth__btn ${!isValid ? "auth__btn_inactive" : ""}`}
            disabled={!isValid ? true : ""}
          >
            {buttonText}
          </button>
        }
        {isLocationSignUp && (
          <div className="auth__block">
            <p className="auth__block_text">Уже зарегистрированы?&nbsp;</p>
            <Link className="auth__block_link" to={"/sign-in"}>
              Войти
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default AuthForm;
