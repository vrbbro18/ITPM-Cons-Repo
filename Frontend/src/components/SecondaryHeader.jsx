import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SecondaryHeader({ pageName, setPageName }) {
  const [show, setShow] = useState("");

  const showNavbar = () => {
    if (show === "") {
      setShow("show");
    } else {
      setShow("");
    }
  };
  return (
    <div className="container-fluid sticky-top bg-dark bg-light-radial shadow-sm px-3 pe-lg-0">
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0">
        <Link
          to="/construction-company-react-app"
          onClick={(e) => {
            setPageName("Home");
            setShow("");
          }}
          className="navbar-brand"
        >
          <h1 className="m-0 display-4 text-white">
            <i className="bi bi-building text-primary me-2"></i>BuildEase
          </h1>
        </Link>
        <button
          onClick={showNavbar}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${show}`} id="navbarCollapse">
          <div className="navbar-nav ms-auto py-0">
            <Link
              to="/construction-company-react-app"
              className={`nav-item nav-link ${pageName === "Home" && "active"}`}
              onClick={(e) => {
                setPageName("Home");
                setShow("");
              }}
            >
              Home
            </Link>
            <Link
              to="/construction-company-react-app/about"
              className={`nav-item nav-link ${
                pageName === "About" && "active"
              }`}
              onClick={(e) => {
                setPageName("About");
                setShow("");
              }}
            >
              About
            </Link>
            <Link
              to="/construction-company-react-app/services"
              className={`nav-item nav-link ${
                pageName === "Service" && "active"
              }`}
              onClick={(e) => {
                setPageName("Service");
                setShow("");
              }}
            >
              Service
            </Link>
            <Link
              to="/construction-company-react-app/blogs"
              className={`nav-item nav-link ${
                pageName === "Blogs" && "active"
              }`}
              onClick={(e) => {
                setPageName("Blogs");
                setShow("");
              }}
            >
              Blogs
            </Link>
            <Link
              to="/construction-company-react-app/contact"
              className={`nav-item nav-link ${
                pageName === "Contact" && "active"
              }`}
              onClick={(e) => {
                setPageName("Contact");
                setShow("");
              }}
            >
              Contact Us
            </Link>
            <Link
              to="/construction-company-react-app/SignIn"
              className={`nav-item nav-link ${
                pageName === "SignIn" && "active"
              }`}
              onClick={(e) => {
                setPageName("SignIn");
                setShow("");
              }}
            >
              User
            </Link>
            
          </div>
        </div>
      </nav>
    </div>
  );
}
