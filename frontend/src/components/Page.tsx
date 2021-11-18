import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Page({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
