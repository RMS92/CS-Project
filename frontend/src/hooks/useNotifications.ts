import { useCallback, useMemo, useReducer } from "react";
import { apiFetch } from "../utils/api";
import { NotificationType } from "../types";
import { ADD_COMMENT } from "./useComments";

export const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
export const FETCH_NOTIFICATIONS_RESPONSE = "FETCH_NOTIFICATIONS_RESPONSE";
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const DELETE_NOTIFICATION = "DELETE_NOTIFICATION";

function reducer(state: any, action: any) {
  // console.log("COMMENTS REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true };
    case FETCH_NOTIFICATIONS_RESPONSE:
      return { ...state, loading: false, notifications: action.payload };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (u: NotificationType) => u !== action.payload
        ),
      };
  }
}

export function useNotifications() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    notifications: null,
  });

  return {
    loading: state.loading,
    notifications: state.notifications,
    fetchNotifications: useCallback(async () => {
      if (state.notifications !== null) {
        return null;
      }
      dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
      const data = await apiFetch("/notifications/admin");
      dispatch({ type: FETCH_NOTIFICATIONS_RESPONSE, payload: data });
    }, [state.notifications]),
    createNotification: useCallback(async (data) => {
      const newNotification = await apiFetch("/notifications", {
        method: "post",
        body: JSON.stringify(data),
        dataType: "json",
      });
      dispatch({ type: ADD_COMMENT, payload: newNotification });
      return newNotification;
    }, []),
    deleteNotification: useCallback(async (notification: NotificationType) => {
      dispatch({ type: DELETE_NOTIFICATION, payload: notification });
      await apiFetch("/notifications/" + notification.id + "/admin", {
        method: "delete",
      });
    }, []),
  };
}
