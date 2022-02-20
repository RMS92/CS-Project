import React, { useEffect, useState } from "react";
import Icon from "../ui/Icon";
import clsx from "clsx";
import { apiFetch } from "../utils/api";
import { useParams } from "react-router-dom";
import { User, Event } from "../types";
import EventCard from "../ui/Cards";

export default function Profil() {
  const [page, setPage] = useState("events");
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [participants, setParticipants] = useState<User[]>([]);

  // @ts-ignore
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const resUser = await apiFetch("/users/" + id);
      setUser(resUser);

      const res = await apiFetch("/events/users/" + id);
      setEvents(res);

      // Get all participants
      const res2 = await apiFetch("/users/events");
      setParticipants(res2);
    })();
  }, []);

  return (
    <div className="container py5">
      <div className="stack-extra mb5">
        <div className="events-hero stack">
          <div className="hero-title">Profil de {user?.pseudo}</div>
          <div className="hero-text">
            Tu es sur la page du profil de cet utilisateur et tu peux voir les
            évènements auxquels il participe :)
            <br />
            N&apos;hésites pas à consulter toi aussi ces évènements et par
            l'occasion t&apos;y inscrire si ces derniers te plaisent.
          </div>
        </div>
      </div>
      <div className="profil-nav">
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
      </div>
      <ProfilBody page={page} events={events} participants={participants} />
    </div>
  );
}

function ProfilBody({
  page,
  events,
  participants,
}: {
  page: string;
  events: Event[];
  participants: User[];
}) {
  return page === "events" ? (
    <ProfilBodyEvents events={events} participants={participants} />
  ) : null;
}

function ProfilBodyEvents({
  events,
  participants,
}: {
  events: Event[];
  participants: User[];
}) {
  return (
    <div className="events mt5">
      {events.map((e: Event) => (
        <EventCard
          key={e.id}
          // @ts-ignore
          participants={participants.filter((p) => p.event_id === e.id)}
          event={e}
          onDelete={Promise.resolve}
        />
      ))}
    </div>
  );
}
