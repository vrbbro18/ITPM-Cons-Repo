import React from "react";

export default function Contact() {
  return (
    <div className="container-fluid py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
        <h1 className="display-5 text-uppercase mb-4">
          Please <span className="text-primary">Feel Free</span> To Contact Us
        </h1>
      </div>
      <div className="row gx-0 align-items-center">
        <div className="col-lg-6 mb-5 mb-lg-0" style={{ height: "600px" }}>
          {/* Optional: Add Google Map iframe here */}
        </div>
        <div className="col-lg-6">
          <div className="contact-form bg-light p-5">
            <div className="row g-3">
              {/* Name */}
              <div className="col-12 col-sm-6">
                <input
                  type="text"
                  className="form-control border-0"
                  placeholder="Your Name"
                  style={{ height: "55px" }}
                />
              </div>
              {/* Email */}
              <div className="col-12 col-sm-6">
                <input
                  type="email"
                  className="form-control border-0"
                  placeholder="Your Email"
                  style={{ height: "55px" }}
                />
              </div>
              {/* Phone Number */}
              <div className="col-12 col-sm-6">
                <input
                  type="tel"
                  className="form-control border-0"
                  placeholder="Your Phone Number"
                  style={{ height: "55px" }}
                />
              </div>
              {/* Construction or Consulting Option */}
              <div className="col-12 col-sm-6">
                <select
                  className="form-control border-0"
                  style={{ height: "55px" }}
                >
                  <option value="" disabled selected>
                    Choose Option
                  </option>
                  <option value="construction">Construction</option>
                  <option value="consulting">Consulting</option>
                </select>
              </div>
              {/* Message */}
              <div className="col-12">
                <textarea
                  className="form-control border-0"
                  rows="4"
                  placeholder="Message"
                  style={{ height: "150px" }}
                ></textarea>
              </div>
              <div className="col-12">
                <button className="btn btn-primary w-100 py-3" type="submit">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
