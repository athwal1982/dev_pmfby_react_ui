import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import sliderimg from "./../../../assets/img/slider.jpg";
import { Container } from "react-bootstrap";

const Sliders = () => {
  return (
    <Carousel
      showThumbs={false} // Hides thumbnail navigation
      showArrows={false} // Shows navigation arrows
      showStatus={false} // Hides the status (e.g., "1 of 3")
      infiniteLoop={true} // Enables infinite loop
      autoPlay={true} // Enables auto-play
      interval={3000} // Sets auto-play interval to 3 seconds
      stopOnHover={true} // Stops auto-play on hover
      swipeable={true} // Enables swipe gestures
      emulateTouch={true} // Enables touch emulation for desktop
    >
      <div className="slider">
        <img src={sliderimg} alt="Slide 1" />
        <div className="content">
          <Container>
            <h1>
              Having a concern regarding <br /> Pradhan Mantri Fasal Bima Yojana (PMFBY)
            </h1>
          </Container>
        </div>
      </div>
    </Carousel>
  );
};

export default Sliders;
