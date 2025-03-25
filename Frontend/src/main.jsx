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
import SignIn from "./components/SignIn.jsx";
import ProjectList from "./components/pages/ProjectList.jsx";
import ProjectDetails from "./components/pages/ProjectDetails.jsx";
import MainDashboard from "./components/MainDashboard.jsx";
import CustomerForm from "./components/pages/Customer/CustomerForm";
import CustomerDetails from "./components/pages/Customer/CustomerDetails";
import EditProject from "./components/pages/Customer/EditProject";

const router = createBrowserRouter([
  {
    path: "/construction-company-react-app",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <AboutTab /> },
      { path: "services", element: <ServicesTab /> },
      { path: "blogs", element: <Blogs blogsNumber={10} /> },
      { path: "blogdetails/:id", element: <BlogDetails /> },
      { path: "contact", element: <ContactTab /> },
      { path: "signin", element: <SignIn /> },
      { path: "projects", element: <ProjectList /> },
      { path: "projectDetails/:id", element: <ProjectDetails /> },
      { path: "MainDashboard", element: <MainDashboard /> },
      // Add customer routes
      { path: "customer", element: <CustomerForm /> },
      { path: "customer-details", element: <CustomerDetails /> },
      { path: "projects/edit/:id", element: <EditProject /> },
      { path: "projects/:serviceType", element: <ProjectList /> }
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