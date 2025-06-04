import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import BizClass from "./beforeLoginFooter.module.scss";

function BeforeLoginFooter() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <footer className={BizClass.landingPageFooter + " " + "mt-auto"}>
            <div className="mt-auto">
              <Container>
                <Row>
                  <Col xs={12} className={BizClass.footerNavBox}>
                    <Navbar className={BizClass.footerNav + " " + "bg-light"}>
                      <Nav className="d-flex justify-content-center align-items-center flex-wrap mx-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/about">About us</Nav.Link>
                        <Nav.Link href="/help">Help</Nav.Link>
                        <Nav.Link href="/faq">FAQs</Nav.Link>
                        <Nav.Link href="/feedback">Feedback</Nav.Link>
                        <Nav.Link href="/rti">RTI</Nav.Link>
                        <Nav.Link href="/t&c">Terms and Conditions</Nav.Link>
                        <Nav.Link href="/copyrightPolicy">Copyright Policy</Nav.Link>
                        <Nav.Link href="/hyperlinkingPolicy">Hyperlinking Policy</Nav.Link>
                        <Nav.Link href="/privacyPolicy">Privacy Policy</Nav.Link>
                        <Nav.Link href="/statementWebsitePolicy">Website Policy</Nav.Link>
                        <Nav.Link href="/contact">Contact</Nav.Link>
                        <Nav.Link href="/sitemap">Sitemap</Nav.Link>
                      </Nav>
                    </Navbar>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className={BizClass.footerNavBox}>
                    <div className={BizClass.footerBottomSection}>
                      <p className="mb-2 pb-0">
                        Join us on &nbsp;
                        <a href="https://www.facebook.com/PMFasalBimaYojana" title="Facebook" target="_blank">
                          Facebook
                        </a>{" "}
                        |{" "}
                        <a href="https://twitter.com/pmfby" title="X-Twitter" target="_blank">
                          {" "}
                          X-Twitter
                        </a>{" "}
                        |{" "}
                        <a href="https://www.instagram.com/pmfasalbimayojana/" title="Instagram" target="_blank">
                          Instagram
                        </a>{" "}
                        and{" "}
                        <a href="/SocialLinks" title="More Social links">
                          More{" "}
                        </a>
                        &nbsp;||&nbsp;
                        <a href="/webInformationManager" title="Web Information Manager">
                          Web Information Manager
                        </a>
                      </p>
                      <p className={BizClass.copyrightText + " " + "text-white py-0 mb-0 copyrightText"}>
                        Copyright @ For Department of Agriculture and Farmers Welfare, Ministry of Agriculture and Farmers Welfare, Government of India. All
                        Rights Reserved.
                      </p>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </footer>
        </Col>
      </Row>
    </Container>
  );
}

export default BeforeLoginFooter;
