import React from "react";
import Service from "./elements/Service";
import { useSelector } from "react-redux";
export default function Services() {
  const services = useSelector((store) => store.services);

  return (
    <div className="container-fluid bg-light py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
        <h1 className="display-5 text-uppercase mb-4">
          We Provide <span className="text-primary">The Best</span> Construction
          Services
        </h1>
      </div>
      <div className="row g-5">
        {services.map((service, index) => (
          <Service service={service} key={index} />
        ))}
      </div>
    </div>
  );
}
