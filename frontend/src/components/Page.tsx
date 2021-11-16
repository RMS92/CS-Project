import React from "react";
import Header from "./Header";

export default function Page({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
