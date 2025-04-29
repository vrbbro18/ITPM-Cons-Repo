export default function Team({ team }) {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div className="row g-0">
        <div className="col-10" style={{ minHeight: "300px" }}>
          <div className="position-relative h-100">
            <img
              className="position-absolute w-100 h-100"
              src={team.img}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="col-2">
          <div className="h-100 d-flex flex-column align-items-center justify-content-between bg-light">
            <a className="btn" href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a className="btn" href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a className="btn" href="#">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a className="btn" href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a className="btn" href="#">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        <div className="col-12">
          <div className="bg-light p-4">
            <h4 className="text-uppercase">{team.nam}</h4>
            <span>{team.position}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
