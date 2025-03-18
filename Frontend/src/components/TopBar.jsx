import React from "react";

export default function TopBar() {
  return (
    <div className="container-fluid px-5 d-none d-lg-block">
      <div className="row gx-5">
        <div className="col-lg-4 text-center py-3">
          <div className="d-inline-flex align-items-center">
            <i className="bi bi-geo-alt fs-1 text-primary me-3"></i>
            <div className="text-start">
              <h6 className="text-uppercase fw-bold">Our Office</h6>
              <span>Kotli Azad Kashmir</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4 text-center border-start border-end py-3">
          <div className="d-inline-flex align-items-center">
            <i className="bi bi-envelope-open fs-1 text-primary me-3"></i>
            <div className="text-start">
              <h6 className="text-uppercase fw-bold">Email Us</h6>
              <span>afraheemraz789@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4 text-center py-3">
          <div className="d-inline-flex align-items-center">
            <i className="bi bi-phone-vibrate fs-1 text-primary me-3"></i>
            <div className="text-start">
              <h6 className="text-uppercase fw-bold">Call Us</h6>
              <span>+92 301 8592729</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
