import React from "react";
import { NavLink } from "react-router-dom";
import Icon from "../ui/Icon";

export default function Header() {
  return (
    <nav className="header">
      <ul className="header-nav">
        <li className="header__home">
          <NavLink exact to="/">
            <Icon name="home" />
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/">
            <Icon name="events" /> Evènements
          </NavLink>
        </li>
      </ul>
      <ul className="header-side">
        <li className="header__search">
          <div className="form-group" style={{ position: "relative" }}>
            <input className="search" placeholder="Recherche..." />
            <button>
              <Icon name="search" />
            </button>
          </div>
        </li>
        <li className="header__auth">
          <NavLink exact to="/inscription" className="btn-primary-outlined">
            S'inscrire
          </NavLink>
          <span className="text-muted"> · </span>
          <NavLink exact to="/connexion" className="btn-primary">
            Me connecter
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
