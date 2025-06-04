import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import tutorialimg from "../../../assets/img/tutorial.png";
import circular from "../../../assets/img/circular.png";
import insuarance from "../../../assets/img/insuarance.png";
import bank from "../../../assets/img/bank.png";
import { Link } from "react-router-dom";

const Otherlinks = () => {
  const data = [
    {
      name: "Tutorials",
      image: tutorialimg,
      link: "https://pmfby.gov.in/tutorials",
    },
    {
      name: "Circulars",
      image: circular,
      link: "https://pmfby.gov.in/circulars",
    },
    {
      name: "Insurance Company & Broker Directory",
      image: insuarance,
      link: "https://pmfby.gov.in/insuranceCompanyDirectory",
    },
    {
      name: "Bank Branch Directory",
      image: bank,
      link: "https://pmfby.gov.in/bankBranchDirectory",
    },
  ];
  return (
    <div className="other_link">
      <Container className="py-5">
        <Row>
          <Col md={12}>
            <h3 className="text-center title">Other Links</h3>
          </Col>
        </Row>
        <Row className="pt-3">
          {data.map((item, index) => {
            return (
              <Col md={3} key={index}>
                <div className="item-container">
                  <div>
                    <img src={item?.image} className="item-icon" />
                  </div>
                  <Link to={item?.link} target="_blank" className="item-name">
                    {item?.name}
                  </Link>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Otherlinks;
