import React from "react";
import SecondaryCarousel from "../components/elements/SecondaryCarousel";
import Contact from "../components/Contact";

export default function ContactTab() {
  return (
    <>
      <SecondaryCarousel pageName={"Contact"} />
      <Contact />
    </>
  );
}
