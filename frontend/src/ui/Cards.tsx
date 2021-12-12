import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDescription } from "../utils/functions";
import { Event } from "../types";

export default function EventCard({
  event,
  editable = false,
  onDelete,
}: {
  event: Event;
  editable?: boolean;
  onDelete: (e: Event) => Promise<void>;
}) {
  const beginDate = new Date(parseFloat(event.begin_at)).toLocaleDateString();

  return (
    <div className="card">
      <div className="card__body stack">
        <div className="card__title">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </div>
        <div className="card__description mb2">
          <p>{formatDescription(event.content)}</p>
        </div>
        <Link to={`/events/${event.id}`} className="card__link" />
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
          {event.duration <= 60 ? event.duration : event.duration / 60}
          {event.duration <= 60 ? " min" : " heures"}
        </div>
      </footer>
      <div className="card__badge">{beginDate}</div>
      {editable ? (
        <div className="card__icons" onClick={() => onDelete(event)}>
          <Icon name="delete" className="icon icon-delete" />
        </div>
      ) : null}
    </div>
  );
}
