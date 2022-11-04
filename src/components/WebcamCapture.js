import React, { useContext, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import styled from "styled-components";
import getPoi from "../getPoi";

import { UserContext } from "../App";

const StatusLight = styled.div`
  position: absolute;
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  background-color: ${(props) => (props.isConnected ? "green" : "red")};
  margin: 1rem;
  left: 0;
  top: 0;
`;

const Container = styled.div`
  video {
    position: absolute;
    opacity: 0.01;
  }
`;

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const { setUser, user } = useContext(UserContext);
  const [intervalId, setIntervalId] = useState(true);

  React.useEffect(() => {
    if (intervalId) {
      const intervalId = setInterval(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        var base64Data = imageSrc.replace(/^data:image\/jpeg;base64,/, "");
        base64Data += base64Data.replace("+", " ");
        axios
          .get(`${process.env.REACT_APP_USER_SERVER_ENDOINT}/alive`)
          .then(() => {
            axios
              .post(`${process.env.REACT_APP_USER_SERVER_ENDOINT}/face_rec`, {
                type: "image/jpeg",
                image: base64Data,
              })
              .then(async (res) => {
                if (res.data !== "bad image" && res.data !== "not found") {
                  const scheduleWLocations = await Promise.all(
                    res.data.schedule.map(async (event) => {
                      const { identifier } = await getPoi(event.poid);
                      return { ...event, location: identifier };
                    })
                  );

                  setUser({ ...res.data, schedule: scheduleWLocations });
                }
                setConnectionStatus(true);
              })
              .catch(() => setConnectionStatus(false));
          })
          .catch(() => setConnectionStatus(false));
      }, 2000);
      setIntervalId(intervalId);
    }
  }, []);

  return (
    <React.Fragment>
      <StatusLight isConnected={connectionStatus} />
      <Container>
        <Webcam
          muted={true}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      </Container>
    </React.Fragment>
  );
};

export default WebcamCapture;
