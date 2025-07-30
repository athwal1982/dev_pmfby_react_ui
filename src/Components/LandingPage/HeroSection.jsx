import React from "react";
import minis_gif from "../../assets/Landing_Image_N.jpg";
import "./herosImg.css";
const HeroSection = () => {
  return (
    <div className="box_heroSection">
      <div className="main_header">
        <img className="video_HeroSection" src={minis_gif} alt="Hero Background" />
        <div class="banner-text">
          <div>Krishi Rakshak</div>
          <div>Portal and Helpline</div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
