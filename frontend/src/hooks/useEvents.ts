import { useCallback, useMemo, useReducer } from "react";
import { apiFetch } from "../utils/api";
import { Event } from "../types";

export const FETCH_EVENTS_REQUEST = "FETCH_EVENTS_REQUEST";
export const FETCH_EVENTS_RESPONSE = "FETCH_EVENTS_RESPONSE";
export const FETCH_EVENT_REQUEST = "FETCH_EVENT_REQUEST";
export const FETCH_EVENT_RESPONSE = "FETCH_EVENT_RESPONSE";
export const UPDATE_EVENT = "UPDATE_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const SELECT_EVENT = "SELECT_EVENT";
export const DESELECT_EVENT = "DESELECT_EVENT";

function reducer(state: any, action: any) {
  // console.log("EVENTS REDUCE", action.type, action);
  switch (action.type) {
    case FETCH_EVENTS_REQUEST:
      return { ...state, loading: true };
    case FETCH_EVENTS_RESPONSE:
      return { ...state, loading: false, events: action.payload };
    case FETCH_EVENT_REQUEST:
      return {
        ...state,
        selectedEventId: action.id,
        events: state.events.map((s: Event) =>
          s.id === action.id ? { ...s, loading: true } : s
        ),
      };
    case FETCH_EVENT_RESPONSE:
      return {
        ...state,
        selectedEventId: action.id,
        events: state.events.map((s: Event) =>
          s.id === action.id ? action.payload : s
        ),
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map((s: Event) =>
          s === action.target ? { ...s, ...action.payload } : s
        ),
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter((s: Event) => s !== action.payload),
      };
    case SELECT_EVENT:
      return { ...state, selectedEventId: action.payload };
    case DESELECT_EVENT:
      return { ...state, selectedEventId: null };
  }
}

export function useEvents() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    events: null,
    selectedEventId: null,
  });

  const event = useMemo(() => {
    if (!Array.isArray(state.events)) {
      return null;
    }
    for (let s of state.events) {
      if (s._d === state.selectedEventId) {
        return s;
      }
    }
  }, [state.events, state.selectedEventId]);

  return {
    loading: state.loading,
    events: state.events,
    selectedEvent: event,
    fetchEvents: useCallback(
      async (routeOptions: string = "") => {
        if (state.events !== null) {
          return null;
        }
        dispatch({ type: FETCH_EVENTS_REQUEST });
        const data = await apiFetch("/events" + routeOptions);
        dispatch({ type: FETCH_EVENTS_RESPONSE, payload: data });
      },
      [state.events]
    ),
    fetchEvent: useCallback(async (event: Event, type: string) => {
      if (type === "select") {
        dispatch({ type: SELECT_EVENT, payload: event.id });
      } else {
        dispatch({ type: FETCH_EVENT_REQUEST, id: event.id });
        const data = await apiFetch("/events/" + event.id);
        dispatch({ type: FETCH_EVENT_RESPONSE, payload: data, id: event.id });
      }
    }, []),
    updateEvent: useCallback(
      async (event: Event, type: string, data: object) => {
        if (type === "confirm") {
          dispatch({ type: UPDATE_EVENT, target: event, payload: data });
          await apiFetch("/events/" + event.id + "/confirm", {
            method: "PATCH",
            body: JSON.stringify(data),
          });
        } else {
          dispatch({ type: UPDATE_EVENT, target: event, payload: data });
          await apiFetch("/events/" + event.id, {
            method: "PATCH",
            body: JSON.stringify(data),
          });
        }
      },
      []
    ),
    deleteEvent: useCallback(async (event: Event) => {
      dispatch({ type: DELETE_EVENT, payload: event });
      await apiFetch("/events/" + event.id, {
        method: "delete",
      });
    }, []),
    unselectEvent: useCallback(() => dispatch({ type: DESELECT_EVENT }), []),
  };
}
