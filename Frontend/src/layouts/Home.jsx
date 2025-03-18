import React from "react";
import Services from "../components/Services";
import Appointment from "../components/Appointment";
import Portfolio from "../components/Portfolio";
import Teams from "../components/Teams";
import Blogs from "../components/Blogs";
import About from "../components/About";
import Corousel from "../components/Corousel";

export default function Home() {
  return (
    <>
      <Corousel />
      <About />
      <Services />
      <Appointment />
      <Portfolio />
      <Teams />
      <Blogs blogsNumber={3} />
    </>
  );
}
