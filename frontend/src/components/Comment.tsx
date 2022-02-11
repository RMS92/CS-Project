import React, { useEffect, useState } from "react";
import { CommentType, User } from "../types";
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

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/users/" + comment.user_id);
      setAuthor(res);
    })();
  }, []);

  const handleDelete = async () => {
    try {
      await onDelete(comment);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="comment">
      <a className="avatar">
        <img src="/media/default.png" alt="avatar-default" />
      </a>
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
