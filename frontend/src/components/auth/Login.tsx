import React from "react";
import Field from "../../ui/Field";

export default function Login() {
  const handleSubmit = async () => {};

  return (
    <div className="auth-container my5">
      <h1 className="auth-title">Se connecter</h1>
      <form className="auth-form" method="post" onSubmit={handleSubmit}>
        <Field name="email" type="email" placeholder="">
          Adresse email
        </Field>
        <Field name="password" type="password">
          Mot de passe
        </Field>
        <button className="btn-gradient" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}
