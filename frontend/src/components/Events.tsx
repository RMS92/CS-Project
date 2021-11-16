import React from "react";
import EventCard from "../ui/Cards";

export default function Events() {
  return (
    <div className="container py5">
      <div className="stack-extra">
        <div className="events-hero stack">
          <div className="hero-title">
            Les prochains évènements de CS Rennes
          </div>
          <div className="hero-text">
            Vous trouverez ci-dessous les prochains évènements qui auront lieu
            sur le campus CS de Rennes. <br /> Si l'un d'entre eux vous plait,
            vous pouvez vous y inscrire afin de prévenir l'organisateur que vous
            venez :)
            <br />
            C'est facile et simple d'utilisation :p
          </div>
        </div>
        <div className="events">
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
          <EventCard />
        </div>
      </div>
    </div>
  );
}
