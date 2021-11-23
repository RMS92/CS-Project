import React from "react";
import Icon from "../ui/Icon";
import Field from "../ui/Field";
import Comment from "./Comment";

export default function Profil() {
  return (
    <div className="container py5">
      <div className="stack-extra mb5">
        <div className="events-hero stack">
          <div className="hero-title">Profil de Roromain</div>
          <div className="hero-text">
            Tu fais bel et bien partie de la communauté d'évènements de CS
            Rennes :)
            <br />
            N&apos;hésites pas à consulter les détails de ton compte ou encore
            les prochains évènements auquel tu t&apos;es inscrit pour ne pas les
            oublier.
          </div>
        </div>
      </div>
      <hr className="hr-separated" />
    </div>
  );
}
