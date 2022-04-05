import { Event } from "../../../types";
import Icon from "../../../ui/Icon";
import Field from "../../../ui/Field";
import React, { SyntheticEvent, useState } from "react";
import { apiFetch, formToObject } from "../../../utils/api";

export default function DashboardBodyEventsEdit({
  selectedEvent,
  updateAdminEvent,
}: {
  selectedEvent: Event;
  updateAdminEvent: Function;
}) {
  const [fields, setFields] = useState({
    title: selectedEvent.title,
    place: selectedEvent.place,
    begin_at: selectedEvent.begin_at,
    start_time: selectedEvent.start_time,
    duration: selectedEvent.duration,
    content: selectedEvent.content,
  });

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

    try {
      updateAdminEvent(selectedEvent, "", data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="stack-large">
      <div className="stack">
        <h4 className="stack-large__title">
          <Icon name="default" />
          {selectedEvent.title}
        </h4>
        <form className="level1 stack-large p3" onSubmit={handleSubmit}>
          <Field
            name="title"
            type="text"
            value={fields.title}
            placeholder=""
            onChange={handleChange}
          >
            Titre
          </Field>
          <Field
            name="place"
            type="text"
            value={fields.place}
            placeholder="e.g. rue, ville, code postal, pays"
            onChange={handleChange}
          >
            Lieu
          </Field>
          <Field
            name="begin_at"
            value={fields.begin_at}
            type="date"
            placeholder=""
            onChange={handleChange}
          >
            Date début
          </Field>
          <Field
            name="start_time"
            type="text"
            value={fields.start_time}
            placeholder="e.g. 18h30"
            onChange={handleChange}
          >
            Heure de début
          </Field>
          <Field
            name="duration"
            type="text"
            value={fields.duration.toString()}
            placeholder="e.g. 120"
            onChange={handleChange}
          >
            Durée (en minutes)
          </Field>
          <Field
            name="content"
            type="textarea"
            value={fields.content}
            placeholder=""
            onChange={handleChange}
          >
            Description
          </Field>
          <div className="text-right">
            <button className="btn-primary" type="submit">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
