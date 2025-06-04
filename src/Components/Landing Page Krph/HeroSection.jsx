import React from "react";

import { motion } from "framer-motion";
import minis_gif from "../../assets/farmer_img_slide.jpeg";
import "./herosImg.css";
const HeroSection = () => {
  return (
    <motion.div className="box_heroSection" initial={{ opacity: 0, y: -500 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.9, ease: "easeOut" }}>
      
      <div className="main_header" >
    <img className="video_HeroSection" src={minis_gif} alt="Hero Background" style={{ width: "100%", height: "100%" }} />

    {/* Overlay Text */}
    <div
    className="text_part"
      
    >
    <p className="text_one" >Fasal Bima protects you from all your worries!</p>
    </div>
    <div className="pr_mntri">
      <p className="text_two">Pradhan Mantri Fasal Bima Yojna</p>
    </div>
  </div>
    </motion.div>
  );
};

export default HeroSection;
