import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import logo from "../../../assets/img/footer-logo.png";
import locations from "../../../assets/img/locations.svg";
import headphones from "../../../assets/img/headphones-green.svg";
import whatsapp from "../../../assets/img/whatsapp-green.svg";

import youtube from "../../../assets/img/youtube.svg";
import instagram from "../../../assets/img/insta.svg";
import facebook from "../../../assets/img/facebook.svg";
import linkdIn from "../../../assets/img/linkdIn.svg";
import twitter from "../../../assets/img/twitter.svg";

import { Link } from "react-router-dom";

const Footer = () => {
  const mainlink = [
    { name: "Home", link: "/home" },
    { name: "FAQ", link: "/faq" },
    { name: "Feedback", link: "/feedback" },
    { name: "Terms and Conditions", link: "/terms" },
    { name: "Copyright Policy", link: "/copyright" },
    { name: "Policy Privacy", link: "/privacy" },
    { name: "Contact Us", link: "/contact" },
    { name: "Sitemap", link: "/sitemap" },
  ];
  const quicklink = [
    {
      name: "Tutorials",

      link: "https://pmfby.gov.in/tutorials",
    },
    {
      name: "Circulars",

      link: "https://pmfby.gov.in/circulars",
    },
    {
      name: "Insurance Company & Broker Directory",

      link: "https://pmfby.gov.in/insuranceCompanyDirectory",
    },
    {
      name: "Bank Branch Directory",

      link: "https://pmfby.gov.in/bankBranchDirectory",
    },
  ];
  return (
    <>
      <div className="footer">
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={8}>
              <Link to={"/"}>
                <img src={logo} className="footer-logo" />
              </Link>
              <p className="logo-down">
                Crop Insurance is an integrated IT solution and a web-based ecosystem to speed up service delivery, unify fragmented databases, achieve a single
                view of data, and eliminate manual processes. Crop Insurance provides insurance services to farmers faster than before.
              </p>
            </Col>
            <Col md={4}>
              <p className="newsletter">Subscribe Our Newsletter</p>
              <hr className="greenline" />
              <div className="newletter-container">
                <input type="text" className="form-control" placeholder="Enter your email id" />
                <button>Submit</button>
              </div>
            </Col>
          </Row>
          <hr className="redline" />
          <Row className="pt-4">
            <Col md={4} className="pr-3">
              <p className="newsletter">Contact Us</p>
              <hr className="greenline" />
              <ul className="contact-container">
                <li>
                  <img src={locations} alt="" />
                  <p>Department of Agriculture & Farmers Welfare,MoA & FW, Krishi Bhawan, Dr Rajendra Prasad Road, New Delhi - 110001</p>
                </li>
                <li>
                  <img src={headphones} alt="" />
                  <p>Helpline No. : 14434</p>
                </li>
                <li>
                  <img src={whatsapp} alt="" />
                  <p>What's App Number : +91 7065514447</p>
                </li>
              </ul>
            </Col>
            <Col md={4}>
              <p className="newsletter">Main Links</p>
              <hr className="greenline" />
              <ul className="main-link">
                {mainlink.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link to={item?.link} className="decoration">
                        {item?.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Col>
            <Col md={4}>
              <Row>
                <Col md={6}>
                  <p className="newsletter">Quick Links</p>
                  <hr className="greenline" />
                  <ul className="main-link quicklink">
                    {quicklink.map((item, index) => {
                      return (
                        <li key={index}>
                          <Link to={item?.link} className="decoration" target="_blank">
                            {item?.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Col>
                <Col md={6}>
                  <p className="newsletter">Follow Us</p>
                  <hr className="greenline" />
                  <ul className="social-container">
                    <li>
                      <Link>
                        <img src={facebook} className="social-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={twitter} className="social-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={instagram} className="social-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={youtube} className="social-icon" />
                      </Link>
                    </li>
                    <li>
                      <Link>
                        <img src={linkdIn} className="social-icon" />
                      </Link>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="footer-bottom">
        <Container>
          <Row>
            <Col>
              <p className="text-center m-0">
                Copyright @ For Department of Agriculture and Farmers Welfare, Ministry of Agriculture and Farmers Welfare, Government of India. All Rights
                Reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Footer;
