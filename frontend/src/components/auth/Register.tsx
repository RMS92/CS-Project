import React, { SyntheticEvent, useState } from "react";
import Field from "../../ui/Field";
import { apiFetch, formToObject } from "../../utils/api";
import Alert from "../../ui/Alert";
import { FlashMessage } from "../../types";
import clsx from "clsx";

export default function Register() {
  const [flashMessages, setFlashMessages] = useState<FlashMessage | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setFlashMessages(null);

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: string = JSON.stringify(formToObject(form));

    try {
      const res = await apiFetch("/register", {
        method: "post",
        body: data,
        dataType: "json",
      });
      setFlashMessages(res);
      form.reset();
    } catch (e) {
      // @ts-ignore
      setFlashMessages(e);
    }
  };

  return (
    <div className="auth-container my5">
      {flashMessages ? (
        <Alert
          type={clsx(flashMessages.success ? "success" : "danger")}
          isFloating={true}
          onDisappear={setFlashMessages}
        >
          {flashMessages.message}
        </Alert>
      ) : null}
      <h1 className="auth-title">S'inscrire</h1>
      <form className="auth-form" method="post" onSubmit={handleSubmit}>
        <Field name="pseudo">Nom d'utilisateur</Field>
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
