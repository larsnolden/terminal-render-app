import React, { useContext, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import styled from "styled-components";

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
  const { setUser } = useContext(UserContext);

  React.useEffect(() => {
    setInterval(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      var base64Data = imageSrc.replace(/^data:image\/jpeg;base64,/, "");
      base64Data += base64Data.replace("+", " ");
      axios
        .post(`${process.env.REACT_APP_USER_SERVER_ENDOINT}/face_rec`, {
          type: "image/jpeg",
          image: base64Data,
        })
        .then((res) => {
          if (res.data === "not found") setUser(null);
          else setUser(res.data);
          setConnectionStatus(true);
        })
        .catch(() => setConnectionStatus(false));
    }, 2500);
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
