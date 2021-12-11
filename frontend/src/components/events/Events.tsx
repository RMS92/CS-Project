import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import EventCard from "../../ui/Cards";
import { useEvents } from "../../hooks/useEvents";
import { Event } from "../../types";

export default function Events() {
  const { events, fetchEvents } = useEvents();

  useEffect(() => {
    (async () => {
      await fetchEvents();
    })();
  }, []);

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
            id={e.id}
            title={e.title}
            place={e.place}
            description={e.content}
            duration={e.duration}
            begin_at={e.begin_at}
          />
        ))}
      </div>
    </div>
  );
}
