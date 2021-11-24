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
              <Field name="pseudo" type="text">
                Pseudo
              </Field>
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

function ProfilBodyEvents() {
  return (
    <div className="events mt5">
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
    </div>
  );
}

function ProfilBodyInvitations() {
  return (
    <div className="events mt5">
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
      <EventCard />
    </div>
  );
}
