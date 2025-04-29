import React from "react";

export default function PortfolioProject({ project }) {
  return (
    <div className="col-xl-4 col-lg-6 col-md-6 portfolio-item first">
      <div className="position-relative portfolio-box">
        <img className="img-fluid w-100" src={project.img} alt="" />
        <a className="portfolio-title shadow-sm" href="">
          <p className="h4 text-uppercase">{project.name}</p>
          <span className="text-body">
            <i className="fa fa-map-marker-alt text-primary me-2"></i>
            {project.address}
          </span>
        </a>
        <a
          className="portfolio-btn"
          href={project.img}
          data-lightbox="portfolio"
        >
          <i className="bi bi-plus text-white"></i>
        </a>
      </div>
    </div>
  );
}
