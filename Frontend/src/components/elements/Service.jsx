import React from "react";
export default function Service({ service }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="service-item bg-white rounded d-flex flex-column align-items-center text-center">
        <img className="img-fluid" src={service.serviceImg} alt="" />
        <div className="service-icon bg-white">
          <i className={`fa fa-3x ${service.logo} text-primary`}></i>
        </div>
        <div className="px-4 pb-4">
          <h4 className="text-uppercase mb-3">{service.title}</h4>
          <p> {service.body}</p>

          <a className="btn text-primary" href="">
            Read More <i className="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
