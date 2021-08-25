import React from "react";
import AuthForm from "./AuthForm";
import Spinner from "./Spinner";

function Login({ onLogin, isLoading }) {
  return (
    <>
      <Spinner isLoading={isLoading} />
      {!isLoading && (
        <AuthForm
          title="Вход"
          name="login"
          buttonText="Войти"
          onSubmit={onLogin}
        />
      )}
    </>
  );
}

export default Login;
