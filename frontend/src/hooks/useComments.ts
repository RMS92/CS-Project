import { useCallback, useMemo, useReducer } from "react";
import { apiFetch } from "../utils/api";
import { CommentType, Event } from "../types";

export const FETCH_COMMENTS_REQUEST = "FETCH_COMMENTS_REQUEST";
export const FETCH_COMMENTS_RESPONSE = "FETCH_COMMENTS_RESPONSE";
export const ADD_COMMENT = "ADD_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

function reducer(state: any, action: any) {
  // console.log("COMMENTS REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_COMMENTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_COMMENTS_RESPONSE:
      return { ...state, loading: false, comments: action.payload };
    case ADD_COMMENT:
      return { ...state, comments: [...state.comments, action.payload] };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          (s: CommentType) => s !== action.payload
        ),
      };
  }
}

export function useComments() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    comments: null,
  });

  return {
    loading: state.loading,
    comments: state.comments,
    fetchComments: useCallback(async () => {
      if (state.comments !== null) {
        return null;
      }
      dispatch({ type: FETCH_COMMENTS_REQUEST });
      const data = await apiFetch("/comments");
      dispatch({ type: FETCH_COMMENTS_RESPONSE, payload: data });
    }, [state.comments]),
    createComment: useCallback(async (data) => {
      const newComment = await apiFetch("/comments", {
        method: "post",
        body: JSON.stringify(data),
        dataType: "json",
      });
      dispatch({ type: ADD_COMMENT, payload: newComment });
      return newComment;
    }, []),
    deleteComment: useCallback(async (comment: CommentType) => {
      dispatch({ type: DELETE_COMMENT, payload: comment });
      await apiFetch("/comments/" + comment.id, {
        method: "delete",
      });
    }, []),
  };
}
