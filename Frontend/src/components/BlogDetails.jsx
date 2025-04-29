import React from "react";
import blog1 from "../assets/img/blog-1.jpg";
import blog2 from "../assets/img/blog-2.jpg";
import blog3 from "../assets/img/blog-3.jpg";
import user from "../assets/img/user.jpg";
import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";
export default function BlogDetails() {
  const { id } = useParams();

  const blogs = useSelector((store) => store.blogs);
  const blog = blogs.filter((blog) => blog.id === id)[0];

  return (
    <div class="container-fluid py-6 px-5">
      <div class="row g-5">
        <div class="col-lg-8">
          <div class="mb-5">
            <img class="img-fluid w-100 rounded mb-5" src={blog.img} alt="" />
            <h1 class="text-uppercase mb-4">{blog.title}</h1>
            <p>{blog.body}</p>
          </div>

          <div class="mb-5">
            <h3 class="text-uppercase mb-4">3 Comments</h3>
            <div class="d-flex mb-4">
              <img
                src={user}
                class="img-fluid"
                style={{ width: "45px", height: "45px" }}
              />
              <div class="ps-3">
                <h6>
                  <a href="">John Doe</a>{" "}
                  <small>
                    <i>01 Jan 2045</i>
                  </small>
                </h6>
                <p>
                  Diam amet duo labore stet elitr invidunt ea clita ipsum
                  voluptua, tempor labore accusam ipsum et no at. Kasd diam
                  tempor rebum magna dolores sed eirmod
                </p>
                <button class="btn btn-sm btn-light">Reply</button>
              </div>
            </div>
            <div class="d-flex mb-4">
              <img
                src={user}
                class="img-fluid"
                style={{ width: "45px", height: "45px" }}
              />
              <div class="ps-3">
                <h6>
                  <a href="">John Doe</a>{" "}
                  <small>
                    <i>01 Jan 2045</i>
                  </small>
                </h6>
                <p>
                  Diam amet duo labore stet elitr invidunt ea clita ipsum
                  voluptua, tempor labore accusam ipsum et no at. Kasd diam
                  tempor rebum magna dolores sed eirmod
                </p>
                <button class="btn btn-sm btn-light">Reply</button>
              </div>
            </div>
            <div class="d-flex ms-5 mb-4">
              <img
                src={user}
                class="img-fluid"
                style={{ width: "45px", height: "45px" }}
              />
              <div class="ps-3">
                <h6>
                  <a href="">John Doe</a>{" "}
                  <small>
                    <i>01 Jan 2045</i>
                  </small>
                </h6>
                <p>
                  Diam amet duo labore stet elitr invidunt ea clita ipsum
                  voluptua, tempor labore accusam ipsum et no at. Kasd diam
                  tempor rebum magna dolores sed eirmod
                </p>
                <button class="btn btn-sm btn-light">Reply</button>
              </div>
            </div>
          </div>

          <div class="bg-light p-5">
            <h3 class="text-uppercase mb-4">Leave a comment</h3>
            <form>
              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <input
                    type="text"
                    class="form-control bg-white border-0"
                    placeholder="Your Name"
                    style={{ height: "55px" }}
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <input
                    type="email"
                    class="form-control bg-white border-0"
                    placeholder="Your Email"
                    style={{ height: "55px" }}
                  />
                </div>
                <div class="col-12">
                  <input
                    type="text"
                    class="form-control bg-white border-0"
                    placeholder="Website"
                    style={{ height: "55px" }}
                  />
                </div>
                <div class="col-12">
                  <textarea
                    class="form-control bg-white border-0"
                    rows="5"
                    placeholder="Comment"
                  ></textarea>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary w-100 py-3" type="submit">
                    Leave Your Comment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="mb-5">
            <div class="input-group">
              <input
                type="text"
                class="form-control p-3"
                placeholder="Keyword"
              />
              <button class="btn btn-primary px-3">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>

          <div class="mb-5">
            <h3 class="text-uppercase mb-4">Categories</h3>
            <div class="d-flex flex-column justify-content-start bg-light p-4">
              <a class="h6 text-uppercase mb-4" href="#">
                <i class="fa fa-angle-right me-2"></i>Web Design
              </a>
              <a class="h6 text-uppercase mb-4" href="#">
                <i class="fa fa-angle-right me-2"></i>Web Development
              </a>
              <a class="h6 text-uppercase mb-4" href="#">
                <i class="fa fa-angle-right me-2"></i>Web Development
              </a>
              <a class="h6 text-uppercase mb-4" href="#">
                <i class="fa fa-angle-right me-2"></i>Keyword Research
              </a>
              <a class="h6 text-uppercase mb-0" href="#">
                <i class="fa fa-angle-right me-2"></i>Email Marketing
              </a>
            </div>
          </div>

          <div class="mb-5">
            <h3 class="text-uppercase mb-4">Recent Post</h3>
            <div class="bg-light p-4">
              <div class="d-flex mb-3">
                <img
                  class="img-fluid"
                  src={blog1}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  alt=""
                />
                <a
                  href=""
                  class="h6 d-flex align-items-center bg-white text-uppercase px-3 mb-0"
                >
                  Lorem ipsum dolor sit amet consec adipis
                </a>
              </div>
              <div class="d-flex mb-3">
                <img
                  class="img-fluid"
                  src={blog2}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  alt=""
                />
                <a
                  href=""
                  class="h6 d-flex align-items-center bg-white text-uppercase px-3 mb-0"
                >
                  Lorem ipsum dolor sit amet consec adipis
                </a>
              </div>
              <div class="d-flex mb-3">
                <img
                  class="img-fluid"
                  src={blog3}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  alt=""
                />
                <a
                  href=""
                  class="h6 d-flex align-items-center bg-white text-uppercase px-3 mb-0"
                >
                  Lorem ipsum dolor sit amet consec adipis
                </a>
              </div>
            </div>
          </div>

          <div class="mb-5">
            <img src={blog.img} alt="" class="img-fluid rounded" />
          </div>

          <div class="mb-5">
            <h3 class="text-uppercase mb-4">Tag Cloud</h3>
            <div class="d-flex flex-wrap m-n1">
              <a href="" class="btn btn-outline-dark m-1">
                Design
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Development
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Marketing
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                SEO
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Writing
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Consulting
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Design
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Development
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Marketing
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                SEO
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Writing
              </a>
              <a href="" class="btn btn-outline-dark m-1">
                Consulting
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-uppercase mb-4">Plain Text</h3>
            <div
              class="bg-light rounded text-center"
              style={{ padding: "30px" }}
            >
              <p>
                Vero sea et accusam justo dolor accusam lorem consetetur,
                dolores sit amet sit dolor clita kasd justo, diam accusam no sea
                ut tempor magna takimata, amet sit et diam dolor ipsum amet diam
              </p>
              <a href="" class="btn btn-primary py-2 px-4">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
