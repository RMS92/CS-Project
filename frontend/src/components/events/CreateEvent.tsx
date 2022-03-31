import React, { SyntheticEvent, useEffect, useState } from "react";
import { apiFetch, formToObject } from "../../utils/api";
import Icon from "../../ui/Icon";
import Field from "../../ui/Field";
import SelectBox from "../../ui/SelectBox";
import { FlashMessage, User } from "../../types";
import Alert from "../../ui/Alert";
import clsx from "clsx";

export default function CreateEvent({ user }: { user: User }) {
  const [users, setUsers] = useState<User[]>();
  const [filteredValue, setFilteredValue] = useState<User>(user);
  const filteredUsers = (users || []).filter((u: User) => u.id !== user.id);
  const [flashMessages, setFlashMessages] = useState<FlashMessage | null>(null);

  const [participants, setParticipants] = useState<Array<User>>([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/users");
      setUsers(res);
    })();
  }, []);

  const onClick = async (user: User) => {
    setParticipants((p) => [...p, user]);
  };

  const handleDelete = (user: User) => {
    setParticipants(participants.filter((p) => p.id !== user.id));
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const ids = [];

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: object = formToObject(form);

    //
    for (let i = 0; i < participants.length; i++) ids.push(participants[i].id);

    Object.assign(data, { users_ids: ids });

    try {
      await apiFetch("/events", {
        method: "post",
        body: JSON.stringify(data),
        dataType: "json",
      });
      form.reset();
      setFlashMessages({
        status: 200,
        success: true,
        message: "L'évènement a bien été créé.",
      });
      setParticipants([]);
    } catch (err) {
      // @ts-ignore
      setFlashMessages(err);
    }
  };
  return (
    <div className="container py5">
      {flashMessages ? (
        <Alert
          type={clsx(flashMessages.success ? "success" : "danger")}
          isFloating={true}
          onDisappear={setFlashMessages}
        >
          {flashMessages.message}
        </Alert>
      ) : null}
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
              <Field
                name="place"
                type="text"
                placeholder="e.g. rue, ville, code postal, pays"
              >
                Lieu
              </Field>
              <Field name="begin_at" type="date" placeholder="">
                Date début
              </Field>
              <Field name="start_time" type="text" placeholder="e.g. 18h30">
                Heure de début
              </Field>
              <Field name="duration" type="text" placeholder="e.g. 120">
                Durée (en minutes)
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
                onClick={onClick}
              />
            </div>
            <div className="list-group">
              {participants.length != 0
                ? participants.map((p) => (
                    <div className="flex" key={p.id}>
                      <a href={`/profil/${p.id}`} className="avatar">
                        <img src="/media/default.png" alt="avatar-default" />
                      </a>
                      <div className="ml2">
                        <strong className="bold">{p.pseudo}</strong>
                        <br />
                      </div>
                      <div className="list-group__delete">
                        <Icon
                          name="cross"
                          className="icon icon-cross"
                          onClick={() => {
                            handleDelete(p);
                          }}
                        />
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
