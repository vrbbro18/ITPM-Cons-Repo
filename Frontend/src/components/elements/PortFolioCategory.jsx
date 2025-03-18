import React from "react";

export default function PortFolioCategory({ category }) {
  return (
    <li
      className="btn btn-outline-primary bg-white p-2 active mx-2 mb-4"
      data-filter="*"
    >
      <img src={category.img} style={{ width: "150px", height: "100px" }} />
      <div
        className="position-absolute top-0 start-0 end-0 bottom-0 m-2 d-flex align-items-center justify-content-center"
        style={{ background: "rgba(4, 15, 40, .3)" }}
      >
        <h6 className="text-white text-uppercase m-0">{category.name}</h6>
      </div>
    </li>
  );
}
