import React from "react";
import AuthForm from "./AuthForm";

function Register({ onRegister }) {
  return (
    <AuthForm
      title="Регистрация"
      name="register"
      buttonText="Зарегистрироваться"
      onSubmit={onRegister}
    />
  );
}

export default Register;
