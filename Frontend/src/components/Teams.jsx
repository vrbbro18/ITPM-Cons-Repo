import React from "react";
import Team from "./elements/Team";
import { useSelector } from "react-redux";
export default function Teams() {
  const teams = useSelector((store) => store.teams);

  return (
    <div className="container-fluid py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
        <h1 className="display-5 text-uppercase mb-4">
          We Are <span className="text-primary">Professional & Expert</span>
          Workers
        </h1>
      </div>
      <div className="row g-5">
        {teams.map((team, index) => (
          <Team team={team} key={index} />
        ))}
      </div>
    </div>
  );
}
