import React, { Dispatch, SetStateAction } from "react";
import { Link, NavLink } from "react-router-dom";
import Icon from "../ui/Icon";
import { User } from "../types";
import { apiFetch } from "../utils/api";

export default function Header({
  user,
  onConnect,
  setOnConnect,
}: {
  user: User | null;
  onConnect: boolean;
  setOnConnect: Dispatch<SetStateAction<boolean>>;
}) {
  const handleLogout = async () => {
    try {
      const res = await apiFetch("/logout");
      setOnConnect(res);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <nav className="header">
      <ul className="header-nav">
        <li className="header__home">
          <NavLink exact to="/">
            <img
              src={`/media/cs-event_logo.png`}
              alt="cs-event_logo"
              className="header__logo"
            />
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/">
            <Icon name="events" /> Evènements
          </NavLink>
        </li>
      </ul>
      <ul className="header-side">
        {onConnect ? (
          <>
            <li className="header__account">
              <NavLink exact to="/profil">
                <Icon name="user" />
                {user?.pseudo ? user.pseudo : null}
              </NavLink>
            </li>
            <li className="header__logout">
              <Link to="/" onClick={handleLogout}>
                <Icon name="logout" />
              </Link>
            </li>
          </>
        ) : (
          <li className="header__auth">
            <NavLink exact to="/inscription">
              S'inscrire
            </NavLink>
            <span className="text-muted"> · </span>
            <NavLink exact to="/connexion">
              Me connecter
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
