import { useDispatch } from "react-redux";
import user from "../../assets/img/user.jpg";
import { blogsAction } from "../../store/blogSlice";
import BlogDetails from "../BlogDetails";
import { Link } from "react-router-dom";
export default function Blog({ blog }) {
  return (
    <div className="col-lg-4 col-md-6">
      <div className="bg-light">
        <img className="img-fluid" src={blog.img} alt="" />
        <div className="p-4">
          <div className="d-flex justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <img
                className="rounded-circle me-2"
                src={user}
                width="35"
                height="35"
                alt=""
              />
              <span>{blog.username}</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="ms-3">
                <i className="far fa-calendar-alt text-primary me-2"></i>
                {blog.date}
              </span>
            </div>
          </div>
          <h4 className="text-uppercase mb-3">{blog.title}</h4>
          <Link
            className="text-uppercase fw-bold"
            to={`/construction-company-react-app/blogdetails/${blog.id}`}
          >
            Read More <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
