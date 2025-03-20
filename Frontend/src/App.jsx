import Header from "./components/Header";
import Footer from "./components/Footer";
import SecondaryHeader from "./components/SecondaryHeader.jsx";
import SecondaryFooter from "./components/SecondaryFooter.jsx"
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  console.log("Location", location.pathname)

  const showMainHeaderFooterPages = ["/construction-company-react-app", "/construction-company-react-app/about",
     "/construction-company-react-app/services","/construction-company-react-app/blogs",
     "/construction-company-react-app/contact"];

  const isHomePage = showMainHeaderFooterPages.includes(location.pathname);

  return (
    <>
      {isHomePage ? <Header /> : <SecondaryHeader />}
      <Outlet />
      {isHomePage ? <Footer /> : <SecondaryFooter/>}
    </>
  );
}
export default App;
