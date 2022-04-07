import React, { SyntheticEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../../ui/Icon";
import Field from "../../ui/Field";
import { AvatarFile, CommentType, Event, User } from "../../types";
import { apiFetch, formToObject } from "../../utils/api";
import Comment from "../Comment";
import { dateDiff, formatTitle } from "../../utils/functions";
import { useComments } from "../../hooks/useComments";
import DOMPurify from "dompurify";

export default function ShowEvent() {
  const [user, setUser] = useState<User | null>();
  const [event, setEvent] = useState<Event | null>();
  const [author, setAuthor] = useState<User | null>();
  const [participants, setParticipants] = useState<User[] | null>();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [profilPicture, setProfilPicture] = useState<AvatarFile | null>(null);

  // @ts-ignore
  const { id } = useParams();

  const { comments, fetchComments, createComment, deleteComment } =
    useComments();

  const filteredComments = (comments || []).filter(
    (c: CommentType) => c.event_id == id
  );

  useEffect(() => {
    (async () => {
      let resUser = null;
      try {
        resUser = await apiFetch("/me");
        setUser(resUser);
      } catch (e) {
        setUser(null);
      }

      const res = await apiFetch("/events/" + id);
      setEvent(res);

      const res2 = await apiFetch("/users/" + res.user_id);
      setAuthor(res2);

      const res3 = await apiFetch("/users/events/" + id);
      setParticipants(res3);

      // Fetch comments
      await fetchComments();

      if (res2.id === resUser?.id) {
        setIsAuthor(true);
      }

      for (let i = 0; i < res3.length; i++) {
        // console.log(res3[i].id, " ", user?.id);
        if (res3[i].id === resUser?.id) {
          setIsSubscribed(true);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!author?.avatar_id) {
        return;
      }
      const res = await apiFetch("/files/" + author.avatar_id + "/avatarFile");
      setProfilPicture(res);
    })();
  }, [author?.avatar_id]);

  if (!event) {
    return <></>;
  }
  const handleSubmit = async () => {
    const data = { event_id: id };
    try {
      await apiFetch("/events/users", {
        method: "post",
        body: JSON.stringify(data),
        dataType: "json",
      });
      if (user) {
        setParticipants(participants?.concat(user));
        setIsSubscribed(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitComment = async (e: SyntheticEvent) => {
    e.preventDefault();

    const form: HTMLFormElement = e.target as HTMLFormElement;
    const data: object = formToObject(form);

    // @ts-ignore
    Object.assign(data, { content: DOMPurify.sanitize(data.content) });
    console.log(data);

    Object.assign(data, { event_id: id });

    try {
      await createComment(data);
      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py5">
      <div className="stack-extra mb5">
        <div className="events-hero stack">
          <div
            className="hero-title"
            dangerouslySetInnerHTML={{ __html: event.title }}
          />
          <div
            className="hero-text"
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
          <div className="hstack" style={{ display: "block" }}>
            {!user ? (
              <Link to="/connexion" className="btn-primary">
                Se connecter
              </Link>
            ) : isAuthor ? (
              <button className="btn-primary">
                Vous êtes le créateur de l&apos;évènement
              </button>
            ) : isSubscribed ? (
              <button className="btn-primary">
                Vous participer à cet évènement
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSubmit}>
                Participer à l&apos;évènement
              </button>
            )}
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
                L&apos;évènement <strong>{event?.title}</strong> se déroulera le{" "}
                <strong>
                  {new Date(parseFloat(event?.begin_at)).toLocaleDateString()}
                </strong>{" "}
                à {event?.start_time} pour une durée de {event?.duration / 60}h
                à l&apos;adresse: {event.place}.
              </p>
            </div>
          </div>
          <div className="comment-area">
            <div className="comments__title">
              {filteredComments.length} commentaires
            </div>
            <form className="grid" onSubmit={handleSubmitComment}>
              <div className="full">
                <Field name="content" type="textarea">
                  Votre message
                </Field>
              </div>
              <div className="hstack">
                {user ? (
                  <button className="btn-primary" type="submit">
                    Envoyer
                  </button>
                ) : (
                  <Link to="/connexion" className="btn-primary">
                    Se connecter
                  </Link>
                )}
              </div>
            </form>
            <hr />
            <div className="comment-list">
              {filteredComments.map((c: CommentType) => (
                <Comment
                  key={c.id}
                  comment={c}
                  onDelete={deleteComment}
                  user={user}
                />
              ))}
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
                <Link to={`/profil/${author?.id}`} className="avatar">
                  {profilPicture ? (
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        `/media/uploads/profil/${author?.pseudo}/${profilPicture.current_filename}`
                      }
                      alt={`avatar-${author?.pseudo}`}
                    />
                  ) : (
                    <img src="/media/default.png" alt="avatar-default" />
                  )}
                </Link>
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
                  ? participants.map((p: User, i) => (
                      <Participant
                        participant={p}
                        participants={participants}
                        index={i}
                        key={p.id}
                      />
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
      {index < 5 ? (
        <div className="flex">
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
          <div className="ml2">
            <strong className="bold">{participant.pseudo}</strong>
            <br />
          </div>
        </div>
      ) : index === 6 ? (
        <div className="flex">
          <a href={`/profil/${participant.id}`} className="avatar">
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
          </a>
          <div className="ml2">
            <strong className="bold">
              + {participants.length - 5} autres participants
            </strong>
            <br />
          </div>
        </div>
      ) : null}
    </>
  );
}
