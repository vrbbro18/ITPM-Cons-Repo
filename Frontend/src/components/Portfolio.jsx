import React from "react";
import PortFolioCategory from "./elements/PortFolioCategory";
import PortfolioProject from "./elements/PortfolioProject";
import { useSelector } from "react-redux";
export default function Portfolio() {
  const portfolio = useSelector((store) => store.portfolio);
  const categories = portfolio.category;
  const projects = portfolio.project;

  return (
    <div className="container-fluid bg-light py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
        <h1 className="display-5 text-uppercase mb-4">
          Some Of Our <span className="text-primary">Popular</span> Dream
          Projects
        </h1>
      </div>
      <div className="row gx-5">
        <div className="col-12 text-center">
          <div className="d-inline-block bg-dark-radial text-center pt-4 px-5 mb-5">
            <ul className="list-inline mb-0" id="portfolio-flters">
              {categories.map((category, index) => (
                <PortFolioCategory category={category} key={index} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="row g-5 portfolio-container">
        {projects.map((project, index) => (
          <PortfolioProject project={project} key={index} />
        ))}
      </div>
    </div>
  );
}
