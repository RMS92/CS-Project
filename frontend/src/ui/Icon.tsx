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
  ) : name === "default" ? (
    <svg {...props} fill="none" viewBox="0 0 13 12">
      <g clip-path="url(#clip0_90_120)">
        <path
          fill="currentColor"
          d="M11.5 0h-10a1 1 0 00-1 1v2a1 1 0 001 1h10a1 1 0 001-1V1a1 1 0 00-1-1zm1 6H.5v2h12V6zm-5 4h-7v2h7v-2z"
        />
      </g>
      <defs>
        <clipPath id="clip0_90_120">
          <path fill="#fff" d="M0 0h12v12H0z" transform="translate(.5)" />
        </clipPath>
      </defs>
    </svg>
  ) : name === "trash" ? (
    <svg {...props} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6H5H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  ) : name === "clock" ? (
    <svg {...props} fill="none" viewBox="0 0 24 24" id="clock">
      <path
        d="M11.99 2A10 10 0 1012 21.99 10 10 0 0011.99 2zM12 20a8 8 0 110-16 8 8 0 010 16z"
        fill="currentColor"
      />
      <path
        d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"
        fill="currentColor"
      />
    </svg>
  ) : name === "info" ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 3 10"
    >
      <path
        fill="currentColor"
        d="M2.93 3.59l-2.29.29-.08.38.45.08c.3.07.35.17.29.47L.56 8.28c-.2.9.1 1.31.8 1.31.55 0 1.18-.25 1.47-.6l.09-.41c-.2.18-.5.25-.69.25-.27 0-.37-.2-.3-.54l1-4.7zM2 2.5a1 1 0 100-2 1 1 0 000 2z"
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
