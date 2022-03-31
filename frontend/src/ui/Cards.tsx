import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { formatDescription } from "../utils/functions";
import { AvatarFile, Event, User } from "../types";
import { apiFetch } from "../utils/api";

export default function EventCard({
  event,
  participants,
  editable = false,
  onDelete,
}: {
  event: Event;
  participants: User[];
  editable?: boolean;
  onDelete: (e: Event) => Promise<void>;
}) {
  const beginDate = new Date(parseFloat(event.begin_at)).toLocaleDateString();
  return (
    <div className="card">
      <div className="card__body stack">
        <div className="card__title">
          <Link
            to={`/events/${event.id}`}
            dangerouslySetInnerHTML={{ __html: event.title }}
          />
        </div>
        <div className="card__description mb2">
          <p
            dangerouslySetInnerHTML={{
              __html: formatDescription(event.content),
            }}
          />
        </div>
        <Link to={`/events/${event.id}`} className="card__link" />
      </div>
      <div className="card__progress" />
      <footer className="card__footer">
        <div className="card_avatars avatars">
          {participants.length !== 0
            ? participants.map((p, i) => (
                <Participant
                  key={p.id}
                  participant={p}
                  participants={participants}
                  index={i}
                />
              ))
            : null}
        </div>
        <div className="center">
          <Icon name="clock" />
          {event.start_time}
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

function Participant({
  participants,
  participant,
  index,
}: {
  participants: User[];
  participant: User;
  index: number;
}) {
  const [profilPicture, setProfilPicture] = useState<AvatarFile | null>(null);
  useEffect(() => {
    (async () => {
      if (!participant?.avatar_id) {
        return;
      }
      const res = await apiFetch(
        "/files/" + participant.avatar_id + "/avatarFile"
      );
      setProfilPicture(res);
    })();
  }, [participant?.avatar_id]);
  return (
    <>
      {index < 3 ? (
        <Link to={`/profil/${participant.id}`} className="avatar">
          {profilPicture ? (
            <img
              src={
                process.env.PUBLIC_URL +
                `/media/uploads/profil/${participant.pseudo}/${profilPicture.current_filename}`
              }
              alt={`avatar-${participant.pseudo}`}
            />
          ) : (
            <img src="/media/default.png" alt="avatar-default" />
          )}
        </Link>
      ) : index === 3 ? (
        <button className="avatar">+ {participants.length - 3}</button>
      ) : null}
    </>
  );
}
