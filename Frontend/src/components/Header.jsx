import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header({ pageName, setPageName }) {
  const [show, setShow] = useState("");
  const [showServices, setShowServices] = useState(false);

  const showNavbar = () => {
    if (show === "") {
      setShow("show");
    } else {
      setShow("");
    }
  };

  const toggleServices = () => {
    setShowServices(!showServices);
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
            <div className="nav-item dropdown">
              <a
                href="#"
                className={`nav-link dropdown-toggle ${(pageName === "Billing" || pageName === "ProjectServices") && "active"}`}
                onClick={toggleServices}
                style={{ cursor: 'pointer' }}
              >
                Services
              </a>
              <div className={`dropdown-menu m-0 ${showServices ? 'show' : ''}`} style={{ display: showServices ? 'block' : 'none' }}>
                <Link 
                  to="/construction-company-react-app/billing" 
                  className="dropdown-item"
                  onClick={(e) => {
                    setPageName("Billing");
                    setShow("");
                    setShowServices(false);
                  }}
                >
                  <i className="bi bi-receipt me-2"></i>Billing Form
                </Link>
                <Link 
                  to="/construction-company-react-app/project-services" 
                  className="dropdown-item"
                  onClick={(e) => {
                    setPageName("ProjectServices");
                    setShow("");
                    setShowServices(false);
                  }}
                >
                  <i className="bi bi-kanban me-2"></i>Project Services
                </Link>
              </div>
            </div>
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
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Pages
              </a>
              <div className="dropdown-menu m-0">
                <a href="project.html" className="dropdown-item">
                  Our Project
                </a>
                <a href="team.html" className="dropdown-item">
                  The Team
                </a>
                <a href="testimonial.html" className="dropdown-item">
                  Testimonial
                </a>
                <a href="blog.html" className="dropdown-item">
                  Blog Grid
                </a>
                <a href="detail.html" className="dropdown-item">
                  Blog Detail
                </a>
              </div>
            </div>
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
            <Link
              to="/construction-company-react-app/customerDemoForm"
              className="nav-item nav-link bg-secondary text-white px-5 ms-3 d-none d-lg-block"
              onClick={(e) => {
                setPageName("CustomerForm");
                setShow("");
              }}
            >
              Request A Demo <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
