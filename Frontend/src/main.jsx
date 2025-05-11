import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./layouts/Home.jsx";
import AboutTab from "./layouts/AboutTab.jsx";
import ServicesTab from "./layouts/ServicesTab.jsx";
import ContactTab from "./layouts/ContactTab.jsx";
import { Provider } from "react-redux";
import mySiteStore from "./store/index.js";
import Blogs from "./components/Blogs.jsx";
import BlogDetails from "./components/BlogDetails.jsx";
import SignIn from "./components/SignIn.jsx";
import ProjectList from "./components/pages/project/ProjectList.jsx";
import ProjectDetails from "./components/pages/project/ProjectDetails.jsx";
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
import MaterialDashboard from "./components/pages/Materials/MaterialDashboard.jsx";
import Signup from "./components/SignUp.jsx";

import ProjectDashboard from "../src/components/pages/project/ProjectDashboard.jsx";
import BillingForm from "./components/pages/Services/BillingForm.jsx";
import ProjectServices from "./components/pages/Services/ProjectServices.jsx";

import ProjectDashboard from "../src/components/pages/project/ProjectDashboard.jsx"
import '@fortawesome/fontawesome-free/css/all.min.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={mySiteStore}>
      <BrowserRouter>
        <Routes>
          {/* Main Route */}
          <Route path="/construction-company-react-app" element={<App />}>
            {/* Nested Routes */}
            <Route index element={<Home />} />
            <Route path="about" element={<AboutTab />} />
            <Route path="services" element={<ServicesTab />} />
            <Route path="blogs" element={<Blogs blogsNumber={10} />} />
            <Route path="blogdetails/:id" element={<BlogDetails />} />
            <Route path="contact" element={<ContactTab />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signUp" element={<Signup />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projectDetails/:id" element={<ProjectDetails />} />
            <Route path="materials/:id" element={<ProjectDetails />} />
            <Route path="customerDashboard" element={<CustomerDashboard />} />
            <Route path="MainDashboard" element={<MainDashboard />} />
            <Route path="customerForm" element={<CustomerForm />} />
            <Route path="editCustomer/:id" element={<EditCustomer />} />
            <Route path="customerList/:serviceType?" element={<CustomerList />} />
            <Route path="constructions" element={<ConstructionPage />} />
            <Route path="consulting" element={<ConsultingPage />} />
            <Route path="customerDemoForm" element={<CustomerDemoForm />} />
            <Route path="MaterialForm" element={<MaterialForm />} />
            <Route path="AddMaterial" element={<AddMaterial />} />
            <Route path="MaterialDashboard" element={<MaterialDashboard />} />
            <Route path="ProjectDashboard" element={<ProjectDashboard />} />

            <Route path="billing" element={<BillingForm />} />
            <Route path="project-services" element={<ProjectServices />} />

            <Route path="editMaterial/:projectId/:materialId" element={<ProjectDetails />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);