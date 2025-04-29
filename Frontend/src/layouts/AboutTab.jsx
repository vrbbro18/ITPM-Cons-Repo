import React from "react";
import SecondaryCarousel from "../components/elements/SecondaryCarousel";
import About from "../components/About";
import Appointment from "../components/Appointment";
import Teams from "../components/Teams";

export default function AboutTab() {
  return (
    <>
      <SecondaryCarousel pageName={"About"} />
      <About />
      <Appointment />
      <Teams />
    </>
  );
}
