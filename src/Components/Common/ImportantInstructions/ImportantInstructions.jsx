import React, {useState, useEffect} from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
// A import ImportantInstructionsImage from "../../../assets/Important_Instructions_Banner.jpg";
import { getCSCCallCenterImage } from "../../Common/Welcome/Service/Methods";
import "./ImportantInstructions.scss";
function ImportantInstructions() {
      const setAlertMessage = AlertMessage();
      const [addImage, setaddImage] = useState([]);
      const getImportantInstrauctionData = async () => {
        debugger;
      try {
          const result = await getCSCCallCenterImage({});
          if (result.response.responseCode === 1) {
            if (result.response.responseData) {
              setaddImage(result.response.responseData);
  
            } else {
              setaddImage([]);
            }
          } else {
            setAlertMessage({
              type: "error",
              message: result.response.responseMessage,
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

    useEffect(() => {
      getImportantInstrauctionData();
    }, []);
  return (
    <div className="ContainerPnlInstructions">
      {/* <a href="https://docs.google.com/spreadsheets/d/16VFtCi8BkNHoUWkErfHr0HgXuCHR79DF/edit?usp=sharing&ouid=110802551208315636984&rtpof=true&sd=true" title="click to view" target="_blank">   
      <img src={ImportantInstructionsImage} style={{ width: "900px", height: "610px" }} />
      </a> */}
      {addImage && addImage.length > 0 && addImage[0].imagePath ? (
    addImage[0].documentURL && addImage[0].documentURL.trim() !== "" ? (
      <a
        href={addImage[0].documentURL}
        title="Click to View"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={addImage[0].imagePath}
          style={{ width: "900px", height: "610px" }}
          alt="Important Instructions"
        />
      </a>
    ) : (
      <img
        src={addImage[0].imagePath}
        style={{ width: "900px", height: "610px" }}
        alt="Important Instructions"
      />
    )
  ) : null}
    </div>
  );
}

export default ImportantInstructions;
