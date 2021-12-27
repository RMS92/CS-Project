import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../../ui/Icon";
import Field from "../../ui/Field";
import { Event, User } from "../../types";
import { apiFetch } from "../../utils/api";
import Comment from "../Comment";
import { dateDiff, formatTitle } from "../../utils/functions";

export default function ShowEvent() {
  const [event, setEvent] = useState<Event | null>();
  const [author, setAuthor] = useState<User | null>();
  const [participants, setParticipants] = useState<User[] | null>();
  // @ts-ignore
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/events/" + id);
      setEvent(res);

      const res2 = await apiFetch("/users/" + res.user_id);
      setAuthor(res2);

      const res3 = await apiFetch("/users/events/" + id);
      setParticipants(res3);
    })();
  }, []);

  if (!event) {
    return <></>;
  }
  const handleSubmit = async () => {};

  return (
    <div className="container py5">
      <div className="stack-extra mb5">
        <div className="events-hero stack">
          <div className="hero-title">{event.title}</div>
          <div className="hero-text">{event.content}</div>
          <div className="hstack" style={{ display: "block" }}>
            <button className="btn-primary">Participer à l'évènement</button>
          </div>
        </div>
      </div>
      <hr className="hr-separated" />
      <div className="layout-sidebar py5">
        <main className="stack-large">
          <div className="stack">
            <h4 className="stack-large__title">
              <Icon name="default" />
              Informations
            </h4>
            <div className="level1 stack-large p3">
              <p>
                L&apos;évènement Barbecue Viande se déroulera le{" "}
                <strong>
                  {new Date(parseFloat(event?.begin_at)).toLocaleDateString()}
                </strong>{" "}
                de {event?.start_time}h à{" "}
                {event?.start_time + event?.duration / 60}h à l&apos;adresse:{" "}
                {event.place}.
              </p>
            </div>
          </div>
          <div className="comment-area">
            <div className="comments__title">6 commentaires</div>
            <form className="grid" onSubmit={handleSubmit}>
              <div className="full">
                <Field name="content" type="textarea">
                  Votre message
                </Field>
              </div>
              <div className="hstack">
                <button className="btn-primary" type="submit">
                  Envoyer
                </button>
              </div>
            </form>
            <hr />
            <div className="comment-list">
              <Comment />
            </div>
          </div>
        </main>
        <aside className="">
          <div className="stack-large">
            <div className="text-right">
              <small className="text-muted">
                {dateDiff(new Date(parseFloat(event?.created_at)))}
              </small>
            </div>
            <div>
              <h5 className="h5 mb2">Créateur</h5>

              <div className="flex">
                <a href={`/profil/${event?.user_id}`} className="avatar">
                  <img src="/media/default.png" alt="avatar-default" />
                </a>
                <div className="ml2">
                  <strong className="bold">
                    {formatTitle(author ? author.pseudo : "")}
                  </strong>
                  <br />
                </div>
              </div>
              <h5 className="h5 mb2 mt2">Participants</h5>
              <div className="list-group">
                {participants
                  ? participants.map((p: User) => (
                      <div className="flex" key={p.id}>
                        <a href={`/profil/${p.id}`} className="avatar">
                          <img src="/media/default.png" alt="avatar-default" />
                        </a>
                        <div className="ml2">
                          <strong className="bold">{p.pseudo}</strong>
                          <br />
                        </div>
                      </div>
                    ))
                  : null}
              </div>
            </div>
            <div></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
