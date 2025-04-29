import React from "react";
import SecondaryCarousel from "../components/elements/SecondaryCarousel";
import Appointment from "../components/Appointment";
import Testimonial from "../components/Testimonial";

export default function ServicesTab() {
  return (
    <>
      <SecondaryCarousel pageName={"Services"} />
      <Appointment />
      <Testimonial />
    </>
  );
}
