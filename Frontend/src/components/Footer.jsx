import React from "react";

export default function Footer() {
  return (
    <>
      <div className="footer container-fluid position-relative bg-dark bg-light-radial text-white-50 py-6 px-5">
        <div className="row g-5">
          <div className="col-lg-6 pe-lg-5">
            <a href="index.html" className="navbar-brand">
              <h1 className="m-0 display-4 text-uppercase text-white">
                <i className="bi bi-building text-primary me-2"></i>WEBUILD
              </h1>
            </a>
            <p>
              Aliquyam sed elitr elitr erat sed diam ipsum eirmod eos lorem
              nonumy. Tempor sea ipsum diam sed clita dolore eos dolores magna
              erat dolore sed stet justo et dolor.
            </p>
            <p>
              <i className="fa fa-map-marker-alt me-2"></i>123 Street, New York,
              USA
            </p>
            <p>
              <i className="fa fa-phone-alt me-2"></i>+012 345 67890
            </p>
            <p>
              <i className="fa fa-envelope me-2"></i>info@example.com
            </p>
            <div className="d-flex justify-content-start mt-4">
              <a
                className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2"
                href="#"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2"
                href="#"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                className="btn btn-lg btn-primary btn-lg-square rounded-0 me-2"
                href="#"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                className="btn btn-lg btn-primary btn-lg-square rounded-0"
                href="#"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-6 ps-lg-5">
            <div className="row g-5">
              <div className="col-sm-6">
                <h4 className="text-white text-uppercase mb-4">Quick Links</h4>
                <div className="d-flex flex-column justify-content-start">
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>Home
                  </a>
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>About Us
                  </a>
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>Our Services
                  </a>
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>Meet The Team
                  </a>
                  <a className="text-white-50" href="#">
                    <i className="fa fa-angle-right me-2"></i>Contact Us
                  </a>
                </div>
              </div>
              <div className="col-sm-6">
                <h4 className="text-white text-uppercase mb-4">
                  Popular Links
                </h4>
                <div className="d-flex flex-column justify-content-start">
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>Home
                  </a>
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>About Us
                  </a>
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>Our Services
                  </a>
                  <a className="text-white-50 mb-2" href="#">
                    <i className="fa fa-angle-right me-2"></i>Meet The Team
                  </a>
                  <a className="text-white-50" href="#">
                    <i className="fa fa-angle-right me-2"></i>Contact Us
                  </a>
                </div>
              </div>
              <div className="col-sm-12">
                <h4 className="text-white text-uppercase mb-4">Newsletter</h4>
                <div className="w-100">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control border-light"
                      style={{ padding: "20px 30px" }}
                      placeholder="Your Email Address"
                    />
                    <button className="btn btn-primary px-4">Sign Up</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid bg-dark bg-light-radial text-white border-top border-primary px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <div className="py-4 px-5 text-center text-md-start">
            <p className="mb-0">
              &copy;{" "}
              <a className="text-primary" href="#">
                Your Site Name
              </a>
              . All Rights Reserved.
            </p>
          </div>
          <div className="py-4 px-5 bg-primary footer-shape position-relative text-center text-md-end">
            <p className="mb-0">
              Designed by{" "}
              <a className="text-dark" href="https://htmlcodex.com">
                HTML Codex
              </a>
            </p>
            <p className="mb-0">
              Distributed by{" "}
              <a className="text-dark" href="https://themewagon.com">
                ThemeWagon
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
