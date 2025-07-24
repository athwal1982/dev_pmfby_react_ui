import React from "react";
import minis_gif from "../../assets/Landing_Image.jpg";
import "./herosImg.css";
const HeroSection = () => {
  return (
    <div className="box_heroSection">
      <div className="main_header">
        <img className="video_HeroSection" src={minis_gif} alt="Hero Background" />
      </div>
    </div>
  );
};

export default HeroSection;
