import React, { useState } from "react";
import Icon from "../ui/Icon";
import Field from "../ui/Field";
import clsx from "clsx";
import EventCard from "../ui/Cards";

export default function Profil() {
  const [page, setPage] = useState("events");

  return (
    <div className="container py5">
      <div className="stack-extra mb5">
        <div className="events-hero stack">
          <div className="hero-title">Profil de Roromain</div>
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
      <ProfilBody page={page} />
    </div>
  );
}

function ProfilBody({ page }: { page: string }) {
  return page === "events" ? <ProfilBodyEvents /> : null;
}

function ProfilBodyEvents() {
  return <div className="events mt5"></div>;
}

function ProfilBodyInvitations() {
  return <div className="events mt5"></div>;
}
