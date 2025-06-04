import "../newhome.css";

import React, { useEffect } from "react";
import Header from "../Layout/Header";
import { Col, Container, Row } from "react-bootstrap";
import locations from "../../../assets/img/locations.svg";
import headphones from "../../../assets/img/headphones-green.svg";
import whatsapp from "../../../assets/img/whatsapp-green.svg";
import playicon from "../../../assets/img/playstore-icon.png";
import { Link } from "react-router-dom";
import Footer from "../Layout/Footer";

const Contact = () => {
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
      <Container className="py-5 contact-us">
        <Row>
          <Col>
            <h1 className="title">Contact Us</h1>
          </Col>
        </Row>
        <Row className="pt-5">
          <Col md={3}>
            <div className="contact-item">
              <div className="contact-title">
                <img src={locations} alt="" /> <span>Address</span>
              </div>
              <p>Department of Agriculture & Farmers Welfare, MoA & FW, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi - 110001</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="contact-item">
              <div className="contact-title">
                <img src={headphones} alt="" /> <span>Helpline Number</span>
              </div>
              <p className="contact-number">14447</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="contact-item">
              <div className="contact-title">
                <img src={whatsapp} alt="" /> <span>What's App Number</span>
              </div>
              <p className="contact-number">+91 7065514447</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="contact-item">
              <div className="contact-title">
                <img src={playicon} alt="" /> <span>Download Our Mobile App</span>
              </div>
              <p className="contact-number">
                <Link to={"https://play.google.com/store/apps/details?id=in.farmguide.farmerapp.central&hl=en_IN"} className="decoration-none" target="_blank">
                  Crop Insurance
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Contact;
