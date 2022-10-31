import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import ReactLoading from "react-loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Pill from "../components/Pill";
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";

dayjs.extend(relativeTime);

const Recognize = ({ messages, latestTranscript }) => {
  const [showTranscript, setShowTranscript] = useState(true);
  //   const messages = [
  //     {
  //       from: "user",
  //       text: "Where is Kris?",
  //     },
  //     {
  //       from: "bot",
  //       text: "Kris is in",
  //       location: "OH111",
  //     },
  //     {
  //       from: "bot",
  //       text: "Would you like me to navigate?",
  //     },
  //     {
  //       from: "user",
  //       text: "Yes",
  //     },
  //   ];

  return (
    <Element
      name="chat"
      className="w-full mb-4 min-h-screen flex flex-col items-center element"
    >
      {messages.map((message) => {
        return (
          <Card
            key={message.text}
            className={`w-9/10 mt-4 rounded-full ${
              message.from === "user" ? "self-end text-right" : "self-start"
            }`}
          >
            <div className="flex flex-row items-center">
              <div className="text-2xl mr-2">
                {message.from === "bot" && "🤖"}
              </div>
              <div className="text-xl">{message.text}</div>
              {message.location && (
                <Pill color="blue" className="ml-2 font-semibold">
                  {message.location}
                </Pill>
              )}
            </div>
          </Card>
        );
      })}
      {latestTranscript && (
        <Card className="w-9/10 mt-4 rounded-fullself-end opacity-90 self-end">
          <div className="flex flex-row items-center">
            <ReactLoading
              type={"bubbles"}
              color={"#44403C"}
              height={"20%"}
              width={"20%"}
            />
            <div className="text-xl ml-4">{latestTranscript}</div>
          </div>
        </Card>
      )}
    </Element>
  );
};

export default Recognize;
