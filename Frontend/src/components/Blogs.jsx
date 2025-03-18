import { useSelector } from "react-redux";
import Blog from "./elements/Blog";

export default function Blogs({ blogsNumber }) {
  const allBlogs = useSelector((store) => store.blogs);
  const blogs = allBlogs.slice(0, blogsNumber);

  return (
    <div className="container-fluid py-6 px-5">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
        <h1 className="display-5 text-uppercase mb-4">
          Latest <span className="text-primary">Articles</span> From Our Blog
          Post
        </h1>
      </div>
      <div className="row g-5">
        {blogs.map((blog, index) => (
          <Blog blog={blog} key={index} />
        ))}
      </div>
    </div>
  );
}
