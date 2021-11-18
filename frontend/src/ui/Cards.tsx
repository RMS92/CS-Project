import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function EventCard() {
  return (
    <div className="card">
      <div className="card__body stack">
        <div className="card__title">
          <Link to={`/events/event`}>Barbecue viande</Link>
        </div>
        <div className="card__description mb2">
          <p>
            Je suis la description de l'évènement et je suis la juste pour
            combler l&apos;espace de text haha, je ne sert donc a rien :p
          </p>
        </div>
        <Link to={`/events/event`} className="card__link" />
      </div>
      <div className="card__progress" />
      <footer className="card__footer">
        <div className="card_avatars avatars">
          <Link to={`/profil/user`} className="avatar">
            <img src="/media/default.png" alt="avatar-default" />
          </Link>
          <Link to={`/profil/user`} className="avatar">
            <img src="/media/default.png" alt="avatar-default" />
          </Link>
        </div>
        <div className="center">
          <Icon name="clock" />
          55 min
        </div>
      </footer>
      <div className="card__badge">17/09</div>
    </div>
  );
}
