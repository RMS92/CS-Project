import React from "react";
import { Props } from "../types";

export default function Icon(props: Props) {
  const name = props.name;

  return name === "events" ? (
    <svg {...props}>
      <svg fill="none" viewBox="0 0 12 12" id="pen">
        <path
          d="M11.58.41a1.4 1.4 0 00-2 0L5 5 4 8l3-1 4.59-4.59a1.41 1.41 0 000-2z"
          fill="currentColor"
        />
        <path
          d="M11.1 6.02a1 1 0 00-1.18.78A4 4 0 115.2 2.08 1 1 0 104.8.12a6 6 0 107.08 7.08 1 1 0 00-.78-1.18z"
          fill="currentColor"
        />
      </svg>
    </svg>
  ) : name === "home" ? (
    <svg {...props} viewBox="0 0 16 16" fill="none">
      <path
        d="M0 5.33333V14.6667C0 15.0203 0.140476 15.3594 0.390524 15.6095C0.640573 15.8595 0.979711 16 1.33333 16H5.33333V10.6667H10.6667V16H14.6667C15.0203 16 15.3594 15.8595 15.6095 15.6095C15.8595 15.3594 16 15.0203 16 14.6667V5.33333L8 0L0 5.33333Z"
        fill="currentColor"
      />
    </svg>
  ) : name === "search" ? (
    <svg
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
    >
      <path
        d="M11.72 10.3L9.18 7.78a5 5 0 10-1.4 1.41l2.53 2.54a1 1 0 001.41-1.41zm-9.7-5.28a3 3 0 116 0 3 3 0 01-6 0z"
        fill="currentColor"
      />
    </svg>
  ) : name === "user" ? (
    <svg {...props} fill="none" viewBox="0 0 12 13">
      <path
        d="M9.54 6.69A4.27 4.27 0 016 9a4.27 4.27 0 01-3.54-2.31c-1.18.86-2 2.11-2.32 3.54a.5.5 0 00.2.51 9.99 9.99 0 0011.32 0 .5.5 0 00.2-.51 5.98 5.98 0 00-2.32-3.54z"
        fill="currentColor"
      />
      <path
        d="M6 .5a3 3 0 00-3 3c0 1.61 1.26 4 3 4s3-2.39 3-4a3 3 0 00-3-3z"
        fill="currentColor"
      />
    </svg>
  ) : null;
}
