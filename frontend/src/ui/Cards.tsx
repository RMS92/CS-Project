import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDescription } from "../utils/functions";

export default function EventCard({
  id,
  title,
  place,
  begin_at,
  duration,
  description,
}: {
  id: string;
  title: string;
  place: string;
  begin_at: string;
  duration: number;
  description: string;
}) {
  const beginDate = new Date(parseFloat(begin_at)).toLocaleDateString();
  return (
    <div className="card">
      <div className="card__body stack">
        <div className="card__title">
          <Link to={`/events/${id}`}>{title}</Link>
        </div>
        <div className="card__description mb2">
          <p>{formatDescription(description)}</p>
        </div>
        <Link to={`/events/${id}`} className="card__link" />
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
          {duration <= 3600 ? duration / 60 : duration / 60 / 60}
          {duration <= 3600 ? " min" : " heures"}
        </div>
      </footer>
      <div className="card__badge">{beginDate}</div>
    </div>
  );
}
