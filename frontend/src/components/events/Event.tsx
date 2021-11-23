import React from "react";
import Icon from "../../ui/Icon";
import Field from "../../ui/Field";
import Comment from "../Comment";

export default function Event() {
  const handleSubmit = async () => {};

  return (
    <div className="container py5">
      <div className="stack-extra mb5">
        <div className="events-hero stack">
          <div className="hero-title">Barbecue viande</div>
          <div className="hero-text">
            Je suis la description de l'évènement et je suis la juste pour
            combler l&apos;espace de text haha, je ne sert donc a rien. Je suis
            la description de l'évènement et je suis la juste pour combler
            l&apos;espace de text haha, je ne sert donc a rien. Je suis la
            description de l'évènement et je suis la :p
          </div>
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
                <strong>21/12/2021</strong> de 16h à 17h à l'adresse: 15 Avenue
                Crampel, Toulouse - 31555
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
              <small className="text-muted">Il y a 1 heure.</small>
            </div>
            <div>
              <h5 className="h5 mb2">Participants</h5>
              <div className="list-group">
                <div className="flex">
                  <a href={`/profil/id`} className="avatar">
                    <img src="/media/default.png" alt="avatar-default" />
                  </a>
                  <div className="ml2">
                    <strong className="bold">Romain Bernard</strong>
                    <br />
                  </div>
                </div>
                <div className="flex">
                  <a href={`/profil/id`} className="avatar">
                    <img src="/media/default.png" alt="avatar-default" />
                  </a>
                  <div className="ml2">
                    <strong className="bold">Olivier Nachin</strong>
                    <br />
                  </div>
                </div>
                <div className="flex">
                  <a href={`/profil/id`} className="avatar">
                    <img src="/media/default.png" alt="avatar-default" />
                  </a>
                  <div className="ml2">
                    <strong className="bold">Antoine Dreyer</strong>
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
