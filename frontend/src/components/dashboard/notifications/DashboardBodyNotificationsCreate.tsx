import React, { SyntheticEvent, useEffect, useState } from "react";
import { apiFetch, formToObject } from "../../../utils/api";
import Icon from "../../../ui/Icon";
import Field from "../../../ui/Field";
import { User } from "../../../types";
import { useEvents } from "../../../hooks/useEvents";

export default function DashboardBodyNotificationsCreate({
  createNotification,
}: {
  createNotification: Function;
}) {
  const [fields, setFields] = useState({
    message: "",
    url: "http://localhost:3000/",
    channel: "public",
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/users");
      setUsers(res);
    })();
  }, []);

  const handleChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setFields({ ...fields, [e.target.name]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: object = formToObject(form);

    console.log(data);

    try {
      for (let i = 0; i < users.length; i++) {
        Object.assign(data, { user_id: users[i].id });
        console.log(data);
        await apiFetch("/notifications", {
          method: "post",
          body: JSON.stringify(data),
          dataType: "json",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="stack-large">
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="default" />
          Envoyer une Notification
        </h4>
        <form className="level1 stack-large p3" onSubmit={handleSubmit}>
          <Field
            name="message"
            type="text"
            value={fields.message}
            placeholder="e.g. message"
            onChange={handleChange}
          >
            Message
          </Field>
          <Field
            name="url"
            type="text"
            value={fields.url}
            placeholder=""
            onChange={handleChange}
          >
            Url
          </Field>
          <Field
            name="channel"
            value={fields.channel}
            type="text"
            placeholder=""
            onChange={handleChange}
          >
            Channel
          </Field>
          <div className="text-right">
            <button className="btn-primary" type="submit">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
