import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from "react";
import Field from "../../ui/Field";
import { apiFetch, formToObject } from "../../utils/api";
import { FlashMessage } from "../../types";
import Alert from "../../ui/Alert";
import clsx from "clsx";

export default function Login({ onConnect }: { onConnect: Function }) {
  const [flashMessages, setFlashMessages] = useState<FlashMessage | null>(null);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setFlashMessages(null);

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: string = JSON.stringify(formToObject(form));

    try {
      await apiFetch("/login", {
        method: "post",
        body: data,
        dataType: "json",
      });
      onConnect(true);
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
      <h1 className="auth-title">Se connecter</h1>
      <form className="auth-form" method="post" onSubmit={handleSubmit}>
        <Field name="pseudo" type="text" placeholder="">
          Nom d&apos;utilisateur
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
