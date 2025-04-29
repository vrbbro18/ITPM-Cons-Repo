import React from "react";
import Service from "./elements/Service";
import { useSelector } from "react-redux";
export default function Services() {
  const services = useSelector((store) => store.services);

  return (
    <div className="container-fluid bg-light py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
        <h1 className="display-5 text-uppercase mb-4" style={{ marginLeft: "-100px"}}>
          We Provide The <span className="text-primary"><br></br> Best</span><br></br> Construction
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
