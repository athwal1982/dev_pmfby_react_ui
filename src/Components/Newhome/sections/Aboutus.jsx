import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import farmerimage from "../../../assets/img/farmers.jpg";
import { Link } from "react-router-dom";

const Aboutus = () => {
  return (
    <div className="about_us">
      <Container className="py-5">
        <Row>
          <Col>
            <div className="about-tag-container">
              <span className="about-tag text-center">ABOUT US</span>
            </div>

            <h1 className="title text-center">Pradhan Mantri Fasal Bima Yojana</h1>
            <p>
              Crop Insurance is an integrated IT solution and a web-based ecosystem to speed up service delivery, unify fragmented databases, achieve a single
              view of data, and eliminate manual processes. Crop Insurance provides insurance services to farmers faster than before.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <img src={farmerimage} className="w-100" />
          </Col>
        </Row>
        <Row className="pt-5">
          <Col md={6}>
            <p>
              The Government is endeavouring for the integration of all the stakeholders viz. farmers, insurance companies, financial institutions & Government
              agencies on single IT platform. This will ensure better administration, coordination & transparency for getting real time information and
              monitoring.
            </p>
            <p>
              This is a stable, secure and seamlessly integrated ecosystem created with a comprehensive view of data in a secure environment thereby enabling
              information access to multiple stakeholders viz. Farmers, Govt. Functionaries, Insurance Companies, Intermediaries, Bankers and social & community
              bodies.
            </p>
          </Col>
          <Col md={6}>
            <p>
              Crop Insurance portal has enabled the digitization of notification of areas, crops, schemes for enabling information access to multiple
              stakeholders thereby facilitating ease of access to the farmers in availing crop insurance services. This automated solution has opened a window
              of opportunity to remote and economically-weak farmers to benefit from crop insurance services.
            </p>
            <Link to={"https://pmfby.gov.in/"} className="btn-official" target="_blank">
              Visit official website PMFBY
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Aboutus;
