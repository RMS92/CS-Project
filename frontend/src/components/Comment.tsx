import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AvatarFile, CommentType, User } from "../types";
import { apiFetch } from "../utils/api";
import { dateDiff } from "../utils/functions";

export default function Comment({
  comment,
  onDelete,
  user,
}: {
  comment: CommentType;
  onDelete: Function;
  user: User | null | undefined;
}) {
  const [author, setAuthor] = useState<User | null>(null);
  const [profilPicture, setProfilPicture] = useState<AvatarFile | null>(null);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/users/" + comment.user_id);
      setAuthor(res);
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

  const handleDelete = async () => {
    try {
      await onDelete(comment);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="comment">
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
      <div className="comment__meta">
        <div className="comment__author">{author?.pseudo}</div>
        <div className="comment__actions">
          <a className="comment__date">
            {dateDiff(new Date(parseFloat(comment.created_at)))}
          </a>
          {user?.id == comment.user_id && (
            <a className="text-danger" onClick={handleDelete}>
              Supprimer
            </a>
          )}
        </div>
      </div>
      <div className="comment__content">
        <div className="formatted">
          <p dangerouslySetInnerHTML={{ __html: comment.content }} />
        </div>
      </div>
    </div>
  );
}
