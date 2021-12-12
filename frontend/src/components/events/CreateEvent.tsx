import React, { SyntheticEvent, useEffect, useState } from "react";
import { apiFetch, formToObject } from "../../utils/api";
import Icon from "../../ui/Icon";
import Field from "../../ui/Field";
import SelectBox from "../../ui/SelectBox";
import { User } from "../../types";

export default function CreateEvent({ user }: { user: User }) {
  const [users, setUsers] = useState<User[]>();
  const [filteredValue, setFilteredValue] = useState<User>(user);
  const filteredUsers = (users || []).filter((u: User) => u.id !== user.id);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/users");
      setUsers(res);
    })();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: string = JSON.stringify(formToObject(form));

    try {
      await apiFetch("/events", {
        method: "post",
        body: data,
        dataType: "json",
      });
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container py5">
      <div className="events-hero stack mb5">
        <div className="hero-title">Créer un nouvel évènement</div>
        <div className="hero-text">
          Vous trouverez ci-dessous le formulaire pour créer un nouvel évènement
          CS sur le campus de Rennes
          <br /> Vous êtes libres d'ajouter autant de participants que vous le
          voulez :)
          <br />
          Il est bon de savoir que n&apos;importe quel étudiant pourra rejoindre
          cet évènement :p
        </div>
      </div>
      <hr className="hr-separated" />
      <div className="layout-sidebar py5">
        <main className="stack-large">
          <div className="stack">
            <h4 className="stack-large__title">
              <Icon name="default" />A completer
            </h4>
            <form className="level1 stack-large p3" onSubmit={handleSubmit}>
              <Field name="title" type="text" placeholder="">
                Titre
              </Field>
              <Field name="place" type="text" placeholder="">
                Lieu
              </Field>
              <Field name="begin_at" type="date" placeholder="">
                Date début
              </Field>
              <Field name="start_time" type="text" placeholder="">
                Heure de début
              </Field>
              <Field name="duration" type="text" placeholder="">
                Durée
              </Field>
              <Field name="content" type="textarea" placeholder="">
                Description
              </Field>
              <div className="text-right">
                <button className="btn-primary" type="submit">
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </main>
        <aside className="">
          <div className="stack-large">
            <div className="text-right">
              <small className="text-muted">Ajouter des participants</small>
            </div>
            <div>
              <h5 className="h5 mb2">Participants</h5>
              <SelectBox
                filteredValue={filteredValue}
                setFilteredValue={setFilteredValue}
                initialValues={filteredUsers}
              />
            </div>
            <div></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
