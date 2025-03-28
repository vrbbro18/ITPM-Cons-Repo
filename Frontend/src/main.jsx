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
import CustomerDashboard from "./components/pages/Customer/customerDashboard.jsx";
import CustomerList from "./components/pages/Customer/customerList.jsx";
import CustomerForm from "./components/pages/Customer/customerForm.jsx";
import EditCustomer from "./components/pages/Customer/editCustomer.jsx";
import ConstructionPage from "./components/pages/Customer/constructionPage.jsx";
import ConsultingPage from "./components/pages/Customer/consultingPage.jsx";
import CustomerDemoForm from "./components/pages/Customer/customerDemoForm.jsx";
import MaterialForm from "./components/pages/Materials/MaterialForm.jsx";
import AddMaterial from "./components/pages/Materials/AddMaterial.jsx";
import MaterialDashboard from "./components/pages/Materials/MaterialDashboard.jsx"
import Signup from "./components/SignUp.jsx";

const router = createBrowserRouter([
  {
    path: "/construction-company-react-app",
    element: <App />,
    children: [
      { path: "", element: <Home /> }, // Default route
      { path: "about", element: <AboutTab /> },
      { path: "services", element: <ServicesTab /> },
      { path: "blogs", element: <Blogs blogsNumber={10} /> },
      { path: "blogdetails/:id", element: <BlogDetails /> },
      { path: "contact", element: <ContactTab /> },
      { path: "signin", element: <SignIn /> },
      { path: "signUp", element: <SignUp />},
      { path: "projects", element: <ProjectList /> },
      { path: "projectDetails/:id", element: <ProjectDetails />},
      { path: "customerDashboard", element: <CustomerDashboard />},
      { path: "MainDashboard", element: <MainDashboard />},
      { path: "customerForm", element: <CustomerForm />},
      { path: "editCustomer/:id", element: <EditCustomer /> },
      { path: "customerList/:serviceType?", element: <CustomerList />},
      { path: "constructions", element: <ConstructionPage /> },
      { path: "consulting", element: <ConsultingPage /> },
      { path: "customerDemoForm", element: <CustomerDemoForm /> },
      { path: "MaterialForm", element: <MaterialForm />},
      { path: "AddMaterial", element: <AddMaterial />},
      { path: "MaterialDashboard", element: <MaterialDashboard />},
      
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