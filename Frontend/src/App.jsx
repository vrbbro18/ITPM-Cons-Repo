import Header from "./components/Header";

import Footer from "./components/Footer";
import { useState } from "react";

import { Outlet } from "react-router-dom";
import BlogDetails from "./components/BlogDetails";

function App() {
  const [pageName, setPageName] = useState("Home");
  return (
    <>
      
      <Header setPageName={setPageName} pageName={pageName} />

      <Outlet />
      <Footer />
    </>
  );
}
export default App;
