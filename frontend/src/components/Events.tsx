import React from "react";
import EventCard from "../ui/Cards";

export default function Events() {
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
      </div>
      <hr className="hr-separated" />
      <div className="events mt5">
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
  );
}
