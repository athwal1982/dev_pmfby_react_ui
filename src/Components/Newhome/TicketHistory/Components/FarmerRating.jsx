import React, { useState } from "react";
import { AlertMessage } from "../../../../Framework/Components/Widgets/Notification/NotificationProvider";
import { Button } from "Framework/Components/Widgets";
import { krphSupportTicketRatingUpdate } from "Components/Newhome/Services/Methods";
const FarmerRating = ({ ticket }) => {
  const setAlertMessage = AlertMessage();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [remarks, setRemarks] = useState("");

  const handleSave = async () => {
    try {
      debugger;
      if (rating === 0) {
        setAlertMessage({
          type: "error",
          message: "Please give the rating",
        });
        return;
      }

      const response = await krphSupportTicketRatingUpdate(ticket.SupportTicketID, ticket.TicketHistoryID, rating, remarks);
      if (response.responseData) {
        setAlertMessage({
          type: "success",
          message: response.responseMessage,
        });
        ticket.Rating = rating;
        ticket.ratingRemarks = remarks;
      } else {
        setAlertMessage({
          type: "error",
          message: response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  return (
    <div style={{ padding: "10px", textAlign: "center", background: "#ffffff", borderRadius: "15px", border: "solid 1px gray" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px", // A space between text and stars
        }}
      >
        <h4 style={{ margin: 0 }}>Rate This:</h4>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px", // A space between stars
            fontSize: "35px",
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: "pointer",
                color: (hover || rating) >= star ? "#ffcc00" : "#ccc",
                transition: "transform 0.2s, color 0.3s",
                transform: hover === star ? "scale(1.2)" : "scale(1)",
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              &#9733;
            </span>
          ))}
        </div>
      </div>
      <p style={{ marginTop: "20px", display: "none" }}>Your rating: {rating}</p>
        <div style={{ marginTop: "20px", textAlign: "left" }}>
     <h6 style={{ margin: 2 }}>
      Rating Remarks:
    </h6>
    <textarea
      id="remarks"
      rows="6"
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
      style={{
        width: "100%",
        padding: "6px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "12px",
        resize: "none",
        outline: "none",
        fontFamily: "inherit",
        minHeight: "120px",
      }}
    />
  </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button type="button" varient="secondary" onClick={() => handleSave()}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default FarmerRating;
