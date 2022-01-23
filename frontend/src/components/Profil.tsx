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
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      // Get participants
      const res = await apiFetch("/users/events");
      setParticipants(res);
    })();
  }, []);

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
      <ProfilBody user={user} page={page} participants={participants} />
    </div>
  );
}

function ProfilBody({
  user,
  page,
  participants,
}: {
  user: User;
  page: string;
  participants: User[];
}) {
  return page === "profil" ? (
    <ProfilBodyEdit user={user} />
  ) : page === "events" ? (
    <ProfilBodyEvents user={user} participants={participants} />
  ) : page === "invitations" ? (
    <ProfilBodyInvitations user={user} participants={participants} />
  ) : null;
}

function ProfilBodyEdit({ user }: { user: User }) {
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
              <Field name="pseudo" type="text" value={user?.pseudo}></Field>
            </div>
            <div className="text-right">
              <button className="btn-primary" type="button">
                Modifier mon pseudo
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
            Supprimer mon compte
          </h4>
          <p className="h5 normal">
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

function ProfilBodyEvents({
  user,
  participants,
}: {
  user: User;
  participants: User[];
}) {
  const { events, fetchEvents, deleteEvent } = useEvents();

  const filteredEvents = (events || []).filter(
    (e: Event) => e.user_id === user.id
  );

  useEffect(() => {
    (async () => {
      await fetchEvents();
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

function ProfilBodyInvitations({
  user,
  participants,
}: {
  user: User;
  participants: User[];
}) {
  const [invitations, setInvitations] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/events/users/" + user.id + "/invitations");
      setInvitations(res);
    })();
  }, []);

  console.log(invitations);
  console.log(participants);

  return (
    <div className="events mt5">
      {invitations.map((e: Event) => (
        <EventCard
          key={e.id}
          // @ts-ignore
          participants={participants.filter((p) => p.event_id === e.event_id)}
          event={e}
          onDelete={Promise.resolve}
        />
      ))}
    </div>
  );
}
