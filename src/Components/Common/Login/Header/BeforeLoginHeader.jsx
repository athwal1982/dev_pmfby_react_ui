import { React } from "react";
import BizClass from "./beforeLoginHeader.module.scss";
import { Container } from "react-bootstrap";

function BeforeLoginHeader() {
  return (
    <Container>
      <header className={BizClass.UpperHeader}>
        <img src="https://pmfby.amnex.co.in/krph/public/img/goi-krph.svg" className={BizClass.goiLogo + " " + "img-fluid mb-2"} />
        <div className={BizClass.mainHeader}>
          <div className="d-flex">
            <a title="PMFBY" href="/" className={BizClass.krpLogo}>
              <img src="https://pmfby.amnex.co.in/pmfby/public/img/logo-product.svg" alt="PMFBY-logo" />
            </a>
            <div className="d-flex flex-column">
              <div class={BizClass.signInInner}>
                <div className={BizClass.longText}>Pradhan Mantri Fasal Bima Yojana</div>
                <div className={BizClass.shortText}>PMFBY</div>
                <div className={BizClass.subTitle}>
                  <i>MINISTRY OF AGRICULTURE &amp; FARMERS WELFARE</i>
                </div>
              </div>
            </div>
          </div>
          <div className={BizClass.krphInfo + " " + "d-flex align-items-center"}>
            <img src="https://pmfby.amnex.co.in/krph/public/img/krishiRakshak.svg" className="img-fluid" alt="Krishi Rakshak Caller" />
            <div className={BizClass.smKrphTitle + " " + "d-flex flex-column"}>
              <div className={BizClass.krphTitle}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className={BizClass.shorForm}>KRPH </div>
                  <div className="ms-auto">
                    <img src="https://pmfby.amnex.co.in/krph/public/img/callingIcon.svg" className="img-fluid" alt="Krishi Rakshak Helpline No." />{" "}
                    <span className={BizClass.dialNumber}>14447</span>
                  </div>
                </div>
              </div>
              <div className={BizClass.krphSubTitle}>Krishi Rakshak Portal & Helpline</div>
            </div>
          </div>
        </div>
      </header>
    </Container>
  );
}

export default BeforeLoginHeader;
