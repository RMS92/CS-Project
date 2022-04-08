import React, { SyntheticEvent, useEffect, useState } from "react";
import Icon from "../ui/Icon";
import Field from "../ui/Field";
import clsx from "clsx";
import EventCard from "../ui/Cards";
import { AvatarFile, User } from "../types";
import { useEvents } from "../hooks/useEvents";
import { Event } from "../types";
import { apiFetch } from "../utils/api";
import Alert from "../ui/Alert";
import { API_URL } from "../config";
import DOMPurify from "dompurify";

export default function Profil({
  user,
  setUser,
  setOnConnect,
}: {
  user: User;
  setUser: Function;
  setOnConnect: Function;
}) {
  const [page, setPage] = useState("profil");
  const [participants, setParticipants] = useState<User[]>([]);
  // @ts-ignore
  const [flashMessages, setFlashMessages] = useState<FlashMessage>(null);
  const [profilPicture, setProfilPicture] = useState<AvatarFile | null>(null);

  useEffect(() => {
    (async () => {
      if (!user?.avatar_id) {
        return;
      }
      setUser(await apiFetch("/me"));
      const res = await apiFetch("/files/" + user.avatar_id + "/avatarFile");
      setProfilPicture(res);
    })();
  }, [user?.avatar_id]);

  const handleChange = async (e: SyntheticEvent) => {
    // @ts-ignore
    const file = e.target.files[0];
    console.log(file);
    const data = new FormData();
    data.append("file", file);
    try {
      // Update user with avatar file
      const res = await fetch(API_URL + "/users/" + user.id + "/avatarFile", {
        credentials: "include",
        method: "PATCH",
        body: data,
      }).then((res) => {
        return res.json().then((data) => {
          return data;
        });
      });

      // Find and set new avatar file from user
      if (res.statusCode !== 400) {
        const file = await apiFetch("/files/" + res.avatar_id + "/avatarFile");
        setProfilPicture(file);
      } else {
        console.log("Incorrect file type");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      // Get participants
      const res = await apiFetch("/users/events");
      setParticipants(res);
    })();
  }, []);

  return (
    <>
      {flashMessages ? (
        <Alert
          type={clsx(flashMessages.success ? "success" : "danger")}
          isFloating={true}
          onDisappear={setFlashMessages}
        >
          {flashMessages.message}
        </Alert>
      ) : null}
      <div className="container py5">
        <header className="page-header separated">
          <div className="profil-header">
            <div className="profil-header__avatar">
              {profilPicture ? (
                <img
                  src={
                    process.env.PUBLIC_URL +
                    `/media/uploads/profil/${user.pseudo}/${profilPicture.current_filename}`
                  }
                  alt={`avatar-${user.pseudo}`}
                />
              ) : (
                <img src="/media/default.png" alt="avatar-default" />
              )}
              <div className="profil-header__upload">
                <Icon name="cloud" width="20" />
              </div>
              <input type="file" name="avatarFile" onChange={handleChange} />
            </div>
            <div className="profil-header__body">
              <h1 className="h1">Mon Profil</h1>
              <p>
                Tu fais bel et bien partie de la communauté d'évènements de CS
                Rennes :)
              </p>
            </div>
          </div>
        </header>
        <div className="profil-nav">
          <a
            href="#"
            className={clsx(
              "h5 normal icon-verticalAlign",
              page === "profil" ? "is-selected" : null
            )}
            onClick={() => setPage("profil")}
          >
            <Icon name="user" className="icon icon-profil" />
            Profil
          </a>
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
          <a
            href="#"
            className={clsx(
              "h5 normal icon-verticalAlign",
              page === "invitations" ? "is-selected" : null
            )}
            onClick={() => setPage("invitations")}
          >
            <Icon name="invitations" className="icon icon-invitations" />
            Invitations
          </a>
        </div>
        <ProfilBody
          user={user}
          page={page}
          participants={participants}
          setFlashMessages={setFlashMessages}
          setOnConnect={setOnConnect}
        />
      </div>
    </>
  );
}

function ProfilBody({
  user,
  page,
  participants,
  setFlashMessages,
  setOnConnect,
}: {
  user: User;
  page: string;
  participants: User[];
  setFlashMessages: Function;
  setOnConnect: Function;
}) {
  return page === "profil" ? (
    <ProfilBodyEdit
      user={user}
      setFlashMessages={setFlashMessages}
      setOnConnect={setOnConnect}
    />
  ) : page === "events" ? (
    <ProfilBodyEvents user={user} participants={participants} />
  ) : page === "invitations" ? (
    <ProfilBodyInvitations user={user} participants={participants} />
  ) : null;
}

function ProfilBodyEdit({
  user,
  setFlashMessages,
  setOnConnect,
}: {
  user: User;
  setFlashMessages: Function;
  setOnConnect: Function;
}) {
  const [pseudo, setPseudo] = useState({
    pseudo: user.pseudo,
  });

  const [password, setPassword] = useState({
    password: "",
  });

  const [password2, setPassword2] = useState("");

  const handlePseudoSubmit = async () => {
    const sanitizePseudo = DOMPurify.sanitize(pseudo.pseudo);
    Object.assign(pseudo, { pseudo: sanitizePseudo });
    try {
      const res = await apiFetch("/users/" + user.id + "/pseudo", {
        method: "PATCH",
        body: JSON.stringify(pseudo),
      });
      setFlashMessages({
        status: 200,
        success: true,
        message: "Votre pseudo a bien été modifié.",
      });
    } catch (err) {
      setFlashMessages(err);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      if (password.password === password2) {
        const sanitizePassword = DOMPurify.sanitize(password.password);
        Object.assign(password, { password: sanitizePassword });
        const res = await apiFetch("/users/" + user.id + "/password", {
          method: "PATCH",
          body: JSON.stringify(password),
        });
        setFlashMessages({
          status: 200,
          success: true,
          message: "Votre mot de passe a bien été modifié.",
        });
      } else {
        setFlashMessages({
          status: 400,
          success: false,
          message: "Les deux mots de passe ne correspondent pas.",
        });
      }
    } catch (err) {
      setFlashMessages(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete cookie
      // const res2 = await apiFetch("/logout");

      // delete cascade set in bdd
      const res = await apiFetch("/users/" + user.id, {
        method: "delete",
      });

      setFlashMessages({
        status: 200,
        success: res,
        message:
          "Votre compte a bien été supprimé. Réactualiser la page pour valider la suppression.",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handlePseudoChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setPseudo({ ...pseudo, [e.target.name]: value });
  };

  const handlePasswordChange = (e: SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;
    // @ts-ignore
    setPassword({ ...password, [e.target.name]: value });
  };

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
              <Field
                name="pseudo"
                type="text"
                value={pseudo.pseudo}
                onChange={handlePseudoChange}
              />
            </div>
            <div className="text-right">
              <button
                className="btn-primary"
                type="button"
                onClick={handlePseudoSubmit}
              >
                Modifier mon pseudo
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
              value={password.password}
              onChange={handlePasswordChange}
            />
            <Field
              name="password2"
              type="password"
              placeholder="Confirmer le mot de passe"
              // @ts-ignore
              onChange={(e: SyntheticEvent) => setPassword2(e.target.value)}
            />
          </div>
          <div className="text-right">
            <button
              className="btn-primary"
              type="button"
              onClick={handlePasswordSubmit}
            >
              Modifier mon mot de passe
            </button>
          </div>
        </form>

        <div className="stack">
          <h4 className="stack-large__title text-danger">
            <Icon name="delete" />
            Supprimer mon compte
          </h4>
          <p className="h5 normal">
            Vous souhaitez supprimer toutes les informations associées à votre
            compte?
          </p>
          <div className="text-right">
            <button
              className="btn-danger"
              type="button"
              onClick={handleDeleteAccount}
            >
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

function ProfilBodyEvents({
  user,
  participants,
}: {
  user: User;
  participants: User[];
}) {
  const { events, fetchEvents, deleteEvent } = useEvents();

  const filteredEvents = (events || []).filter(
    (e: Event) => e.user_id === user.id
  );

  useEffect(() => {
    (async () => {
      await fetchEvents();
    })();
  }, []);

  return filteredEvents && filteredEvents.length !== 0 ? (
    <div className="events mt5">
      {filteredEvents.map((e: Event) => (
        <EventCard
          key={e.id}
          // @ts-ignore
          participants={participants.filter((p) => p.event_id === e.id)}
          editable={true}
          event={e}
          onDelete={deleteEvent}
        />
      ))}{" "}
    </div>
  ) : (
    <div className="py5">
      <p className="text-muted text-center mt1 mb2">
        Tu n&apos;as malheureusement pas encore créé d&apos;évènements sur CS
        Event :(
      </p>
    </div>
  );
}

function ProfilBodyInvitations({
  user,
  participants,
}: {
  user: User;
  participants: User[];
}) {
  const [invitations, setInvitations] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/events/users/" + user.id + "/invitations");
      setInvitations(res);
    })();
  }, []);

  return invitations && invitations.length !== 0 ? (
    <div className="events mt5">
      {invitations.map((e: Event) => (
        <EventCard
          key={e.id}
          // @ts-ignore
          participants={participants.filter((p) => p.event_id === e.id)}
          event={e}
          onDelete={Promise.resolve}
        />
      ))}
    </div>
  ) : (
    <div className="py5">
      <p className="text-muted text-center mt1 mb2">
        Tu ne participe ou n'a pas été invité à aucun évènement publié sur CS
        Event :(
      </p>
    </div>
  );
}
