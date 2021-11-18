import React from "react";
import Field from "../../ui/Field";

export default function Register() {
  const handleSubmit = async () => {};

  return (
    <div className="auth-container my5">
      <h1 className="auth-title">S'inscrire</h1>
      <form className="auth-form" method="post" onSubmit={handleSubmit}>
        <Field name="username">Nom d'utilisateur</Field>
        <Field name="full_name" type="text">
          Nom et prénom
        </Field>
        <Field name="password" type="password">
          Mot de passe
        </Field>
        <Field name="password2" type="password">
          Confirmer le mot de passe
        </Field>
        <button className="btn-gradient" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
