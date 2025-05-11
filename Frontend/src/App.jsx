import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SecondaryFooter from "./components/SecondaryFooter.jsx";
import { Outlet } from "react-router-dom";

function App() {
  const location = useLocation();
  const { pathname } = location;

  const showMainHeaderFooterPages = [
    "/construction-company-react-app",
    "/construction-company-react-app/about",
    "/construction-company-react-app/services",
    "/construction-company-react-app/blogs",
    "/construction-company-react-app/contact"
  

  ];



  const isHomePage = showMainHeaderFooterPages.some((path) => pathname === path)

  return (
    <>
      {isHomePage ? <Header /> : ""}
      <Outlet />
      {isHomePage ? <Footer /> : <SecondaryFooter />}
    </>
  );
}

export default App;
