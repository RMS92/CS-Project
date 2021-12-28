import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../../ui/Cards";
import { useEvents } from "../../hooks/useEvents";
import { Event, User } from "../../types";
import { apiFetch } from "../../utils/api";

export default function Events() {
  const { events, fetchEvents } = useEvents();
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      await fetchEvents();
      // Get all participants
      const res = await apiFetch("/users/events");
      setParticipants(res);
    })();
  }, []);

  console.log(participants);

  if (!events) {
    return <></>;
  }

  return (
    <div className="container py5">
      <div className="events-hero stack mb5">
        <div className="hero-title">Les prochains évènements de CS Rennes</div>
        <div className="hero-text">
          Vous trouverez ci-dessous les prochains évènements qui auront lieu sur
          le campus CS de Rennes. <br /> Si l'un d'entre eux vous plait, vous
          pouvez vous y inscrire afin de prévenir l'organisateur que vous venez
          :)
          <br />
          C'est facile et simple d'utilisation :p
        </div>
        <div className="hstack" style={{ display: "block" }}>
          <Link to={"/events/nouveau"} className="btn-primary">
            Créer un évènement
          </Link>
        </div>
      </div>
      <hr className="hr-separated" />
      <div className="events mt5">
        {events.map((e: Event) => (
          <EventCard
            key={e.id}
            event={e}
            // @ts-ignore
            participants={participants.filter((p) => p.event_id === e.id)}
            onDelete={Promise.resolve}
          />
        ))}
      </div>
    </div>
  );
}
