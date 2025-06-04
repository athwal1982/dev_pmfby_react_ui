import React from "react";
import krphicon from "./../../../assets/img/goi-krph.svg";
import facebook from "../../../assets/img/facebook.png";
import instagram from "../../../assets/img/instagram.png";
import twitter from "../../../assets/img/twitter.png";
import linkdin from "../../../assets/img/linkdIn.png";
import youtube from "../../../assets/img/youtube.png";
import logo from "../../../assets/img/logo.png";
import whatsappicon from "../../../assets/img/whatsapp.svg";
import headphoneicon from "../../../assets/img/headphones_solid.svg";
import playstoreicon from "../../../assets/img/play.png";
import homeicon from "../../../assets/img/home-icon.png";
import claim from "../../../assets/img/claim.png";
import complain from "../../../assets/img/complain.png";
import officers from "../../../assets/img/officers.png";
import contactus from "../../../assets/img/contactus.png";
import world from "../../../assets/img/world.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="header-top">
        <div className="container">
          <div className="flex-center">
            <div>
              <img src={krphicon} className="top-icon" />
            </div>
            <div>
              <ul className="right-main-container">
                <li className="border-right">
                  <p className="main-content">Skip To Main Content</p>
                </li>
                <li className="border-right">
                  <ul className="text-container">
                    <li>Text</li>
                    <li>A-</li>
                    <li>A</li>
                    <li>A+</li>
                  </ul>
                </li>
                <li className="border-right">
                  <div className="lang-container">
                    <div className="language active">English</div>
                    <div className="language">हिंदी</div>
                  </div>
                </li>
                <li>
                  <div className="social-conatiner">
                    <p>Follow Us:</p>
                    <ul className="social-icons-container">
                      <li>
                        <img src={facebook} alt="facebook" />
                      </li>
                      <li>
                        <img src={twitter} alt="twitter" />
                      </li>
                      <li>
                        <img src={instagram} alt="instagram" />
                      </li>
                      <li>
                        <img src={linkdin} alt="linkdin" />
                      </li>
                      <li>
                        <img src={youtube} alt="youtube" />
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="header">
        <div className="container">
          <div className="flex-center">
            <div>
              <Link to={"/"}>
                <img src={logo} className="logo" />
              </Link>
            </div>
            <div>
              <ul className="number-main-container">
                <li>
                  <div className="text-area">
                    <img src={whatsappicon} alt="" width={"20px"} height={"20px"} /> What's App Number
                  </div>
                  <div className="number-area">+91 7065514447</div>
                </li>
                <li>
                  <div className="text-area">
                    <img src={headphoneicon} alt="" width={"20px"} height={"20px"} /> Helpline No.
                  </div>
                  <div className="number-area">14447</div>
                </li>
                <li>
                  <Link to={"https://play.google.com/store/apps/details?id=in.farmguide.farmerapp.central&hl=en_IN"} className="text-none" target="_blank">
                    <div className="playstore">
                      <img src={playstoreicon} className="playicon" />
                      <div className="playtext">
                        <p className="download-text">Download our Mobile App</p>
                        <p>Crop Insurance</p>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="nav-menu-container">
        <div className="container">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to={"/"}>
                <img src={homeicon} /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"#"}>
                <img src={claim} /> Claim Intimation
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/mobile-input"}>
                <img src={complain} /> Complaint Status
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/login"}>
                <img src={officers} /> Officers Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/contact-us"}>
                <img src={contactus} /> Contact Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"https://pmfby.gov.in"} target="_blank">
                <img src={world} /> Official website PMFBY
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
