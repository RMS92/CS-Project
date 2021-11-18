import React from "react";
import Icon from "../ui/Icon";
import Field from "../ui/Field";
import { useToggle } from "../hooks/useToogle";
import Fade from "../ui/animations/Fade";

export default function Comment() {
  const [reply, setReply] = useToggle(false);

  const handleSubmit = async () => {};

  return (
    <div className="comment">
      <a className="avatar">
        <img src="/media/default.png" alt="avatar-default" />
      </a>
      <div className="comment__meta">
        <div className="comment__author">Romain Bernard</div>
        <div className="comment__actions">
          <a className="comment__date">Il y a 1 jour</a>

          <a className="comment__answer" onClick={() => setReply()}>
            <Icon name="reply" width="14" className="icon icon-reply" />
            Répondre
          </a>
        </div>
      </div>
      <div className="comment__content">
        <div className="formatted">
          <p>Je suis le contenu du fabuleux commentaire :)</p>
        </div>
      </div>
      <div className="comment__replies">
        <Fade
          visible={reply}
          duration={300}
          from={{ opacity: 0 }}
          animateEnter={false}
        >
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
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setReply()}
              >
                Annuler
              </button>
            </div>
          </form>
        </Fade>
      </div>
    </div>
  );
}
