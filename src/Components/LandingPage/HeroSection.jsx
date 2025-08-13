import React from "react";
import minis_gif from "../../assets/Landing_Image.jpg";
import grass_green from "../../assets/grass-02.png";
import "./herosImg.css";
const HeroSection = () => {
  return (
    <>
      <div className="box_heroSection">
        <div className="main_header">
          <img className="main-image" src={minis_gif} alt="Hero Background" />
          <img src={grass_green} alt="Grass Overlay" class="grass-overlay" />
          <div class="banner-text">
            <div>Krishi Rakshak</div>
            <div>Portal and Helpline</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
