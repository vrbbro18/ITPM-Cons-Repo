import React from "react";
import signature from "../assets/img/signature.jpg";
import about from "../assets/img/about.jpg";
export default function About() {
  return (
    <div className="container-fluid py-6 px-5">
      <div className="row g-5">
        <div className="col-lg-7">
          <h1 className="display-5 text-uppercase mb-4">
            We are <span className="text-primary">the Leader</span> in
            Construction Industry
          </h1>
          <h4 className="text-uppercase mb-3 text-body">
            Tempor erat elitr at rebum at at clita. Diam dolor diam ipsum tempor
            sit diam amet diam et eos labore
          </h4>
          <p>
            Tempor erat elitr at rebum at at clita aliquyam consetetur. Diam
            dolor diam ipsum et, tempor voluptua sit consetetur sit. Aliquyam
            diam amet diam et eos sadipscing labore. Clita erat ipsum et lorem
            et sit, sed stet no labore lorem sit. Sanctus clita duo justo et
            tempor
          </p>
          <div className="row gx-5 py-2">
            <div className="col-sm-6 mb-2">
              <p className="fw-bold mb-2">
                <i className="fa fa-check text-primary me-3"></i>Perfect
                Planning
              </p>
              <p className="fw-bold mb-2">
                <i className="fa fa-check text-primary me-3"></i>Professional
                Workers
              </p>
              <p className="fw-bold mb-2">
                <i className="fa fa-check text-primary me-3"></i>First Working
                Process
              </p>
            </div>
            <div className="col-sm-6 mb-2">
              <p className="fw-bold mb-2">
                <i className="fa fa-check text-primary me-3"></i>Perfect
                Planning
              </p>
              <p className="fw-bold mb-2">
                <i className="fa fa-check text-primary me-3"></i>Professional
                Workers
              </p>
              <p className="fw-bold mb-2">
                <i className="fa fa-check text-primary me-3"></i>First Working
                Process
              </p>
            </div>
          </div>
          <p className="mb-4">
            Tempor erat elitr at rebum at at clita aliquyam consetetur. Diam
            dolor diam ipsum et, tempor voluptua sit consetetur sit. Aliquyam
            diam amet diam et eos labore
          </p>
          <img src={signature} alt="" />
        </div>
        <div className="col-lg-5 pb-5" style={{ minHeight: "400px" }}>
          <div className="position-relative bg-dark-radial h-100 ms-5">
            <img
              className="position-absolute w-100 h-100 mt-5 ms-n5"
              src={about}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
