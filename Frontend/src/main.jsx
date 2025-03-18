import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./layouts/Home.jsx";
import AboutTab from "./layouts/AboutTab.jsx";
import ServicesTab from "./layouts/ServicesTab.jsx";
import ContactTab from "./layouts/ContactTab.jsx";
import { Provider } from "react-redux";
import mySiteStore from "./store/index.js";
import Blogs from "./components/Blogs.jsx";
import BlogDetails from "./components/BlogDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/construction-company-react-app",
    element: <App />,
    children: [
      { path: "/construction-company-react-app", element: <Home /> },
      { path: "/construction-company-react-app/about", element: <AboutTab /> },
      {
        path: "/construction-company-react-app/services",
        element: <ServicesTab />,
      },
      {
        path: "/construction-company-react-app/blogs",
        element: <Blogs blogsNumber={10} />,
      },
      {
        path: "/construction-company-react-app/blogdetails/:id",
        element: <BlogDetails />,
      },
      {
        path: "/construction-company-react-app/contact",
        element: <ContactTab />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={mySiteStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
