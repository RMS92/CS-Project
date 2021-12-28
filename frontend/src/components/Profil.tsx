import React, { useEffect, useState } from "react";
import Icon from "../ui/Icon";
import Field from "../ui/Field";
import clsx from "clsx";
import EventCard from "../ui/Cards";
import { User } from "../types";
import { formatTitle } from "../utils/functions";
import { useEvents } from "../hooks/useEvents";
import { Event } from "../types";
import { apiFetch } from "../utils/api";

export default function Profil({ user }: { user: User }) {
  const [page, setPage] = useState("profil");

  return (
    <div className="container py5">
      <div className="stack-extra mb5">
        <div className="events-hero stack">
          <div className="hero-title">
            Profil de {formatTitle(user?.pseudo)}
          </div>
          <div className="hero-text">
            Tu fais bel et bien partie de la communauté d'évènements de CS
            Rennes :)
            <br />
            N&apos;hésites pas à consulter les détails de ton compte ou encore
            les prochains évènements auquel tu t&apos;es inscrit pour ne pas les
            oublier.
          </div>
        </div>
      </div>
      <div className="profil-nav">
        <a
          href="#"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "profil" ? "is-selected" : null
          )}
          onClick={() => setPage("profil")}
        >
          <Icon name="user" className="icon icon-profil" />
          Profil
        </a>
        <a
          href="#"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "events" ? "is-selected" : null
          )}
          onClick={() => setPage("events")}
        >
          <Icon name="events" className="icon icon-events" />
          Evènements
        </a>
        <a
          href="#"
          className={clsx(
            "h5 normal icon-verticalAlign",
            page === "invitations" ? "is-selected" : null
          )}
          onClick={() => setPage("invitations")}
        >
          <Icon name="invitations" className="icon icon-invitations" />
          Invitations
        </a>
      </div>
      <ProfilBody user={user} page={page} />
    </div>
  );
}

function ProfilBody({ user, page }: { user: User; page: string }) {
  return page === "profil" ? (
    <ProfilBodyEdit />
  ) : page === "events" ? (
    <ProfilBodyEvents user={user} />
  ) : page === "invitations" ? (
    <ProfilBodyInvitations user={user} />
  ) : null;
}

function ProfilBodyEdit() {
  return (
    <div className="layout-sidebar py5">
      <main className="stack-large">
        <form className="stack-large" method="post">
          <div className="stack">
            <h4 className="stack-large__title">
              <Icon name="user" />
              Mes informations
            </h4>
            <div className="level1 grid p3">
              <Field name="pseudo" type="text"></Field>
            </div>
            <div className="text-right">
              <button className="btn-primary" type="button">
                Mofidier mon profil
              </button>
            </div>
          </div>
        </form>
        <form className="stack">
          <h4 className="stack-large__title">
            <Icon name="mdp" />
            Mot de passe
          </h4>
          <div className="level1 grid2 p3">
            <Field
              name="password"
              type="password"
              placeholder="Nouveau mot de passe"
            />
            <Field
              name="password2"
              type="password"
              placeholder="Confirmer le mot de passe"
            />
          </div>
          <div className="text-right">
            <button className="btn-primary" type="button">
              Mofidier mon mot de passe
            </button>
          </div>
        </form>

        <div className="stack">
          <h4 className="stack-large__title text-danger">
            <Icon name="delete" />
            Danger zone
          </h4>
          <p className="h5 normal">
            Vous n&apos;êtes pas satisfait du contenu de notre application ?
            <br />
            Vous souhaitez supprimer toutes les informations associées à votre
            compte?
          </p>
          <div className="text-right">
            <button className="btn-danger" type="button">
              <Icon
                name="delete"
                width="16"
                height="16"
                className="icon icon-delete"
              />
              Supprimer mon compte
            </button>
          </div>
        </div>
      </main>
      <aside></aside>
    </div>
  );
}

function ProfilBodyEvents({ user }: { user: User }) {
  const { events, fetchEvents, deleteEvent } = useEvents();
  const [participants, setParticipants] = useState<User[]>([]);

  const filteredEvents = (events || []).filter(
    (e: Event) => e.user_id === user.id
  );

  useEffect(() => {
    (async () => {
      await fetchEvents();
      //
      const res = await apiFetch("/users/events");
      setParticipants(res);
    })();
  }, []);

  return (
    <div className="events mt5">
      {filteredEvents.map((e: Event) => (
        <EventCard
          key={e.id}
          // @ts-ignore
          participants={participants.filter((p) => p.event_id === e.id)}
          editable={true}
          event={e}
          onDelete={deleteEvent}
        />
      ))}
    </div>
  );
}

function ProfilBodyInvitations({ user }: { user: User }) {
  return <div className="events mt5"></div>;
}
