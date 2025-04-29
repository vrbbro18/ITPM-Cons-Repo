import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cr1 from "../assets/img/carousel-1.jpg";
import cr2 from "../assets/img/carousel-2.jpg";

export default function Carousel() {
  const [active, setActive] = useState(0);
  const images = [cr1, cr2];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid p-0">
      <div id="header-carousel" className="carousel slide carousel-fade">
        <div className="carousel-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 1 }}
              className="carousel-item active"
            >
              <img className="w-100" src={images[active]} alt="Carousel Image" />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: "700px" }}>
                  <h1 className="display-2 text-uppercase text-white " style={{marginLeft: "80px", marginBottom: "200px"}}>
                    {active === 0 ? "Build Your Dream House With Us" : "We Are Trusted For Your Project"}
                  </h1>
                  <a href="#" className="btn btn-primary py-md-3" style={{marginBottom: "100px"}}>
                    {active === 0 ? "Get A Quote" : "Contact Us"}
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
