import "./newhome.css";

import React, { useEffect } from "react";
import Header from "./Layout/Header";
import Footer from "./Layout/Footer";
import Sliders from "./sections/Sliders";
import Otherlinks from "./sections/Otherlinks";
import Aboutus from "./sections/Aboutus";

const Index = () => {
  useEffect(() => {
    document.body.style.height = "100vh";
    document.body.style.width = "100vw";
    document.body.style.overflowY = "scroll";
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.height = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";
      document.body.style.overflowX = "";
    };
  }, []);
  return (
    <div className="new-home">
      <Header />
      <Sliders />
      <Otherlinks />
      <Aboutus />
      <Footer />
    </div>
  );
};

export default Index;
