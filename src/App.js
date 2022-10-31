import React, { useEffect } from "react";
import { useState, createContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Element, animateScroll as scroll, scroller } from "react-scroll";
import ReactLoading from "react-loading";
import styled from "styled-components";
import WebcamCapture from "./components/WebcamCapture";

import "./App.css";
import Card from "./components/Card";
import Map from "./components/Map";
import Directions from "./components/Directions";

import Recognize from "./views/Recognize";
import Schedule from "./views/Schedule";
import Chat from "./views/Chat";

import getPersonPosition from "./getPersonPosition";
import getPoi from "./getPoi";
import meetWithPerson from "./meetWithPerson";

const locatePerson = async (personName) => {
  const poiId = await getPersonPosition(personName);
  const poi = await getPoi(poiId);
  return poi;
};

export const NavContext = createContext(null);
export const UserContext = createContext(null);

const SpeechInput = styled.div`
  max-width: 210px;
`;

dayjs.extend(relativeTime);

//  dirty global variable
//  setInterval does not use the latest of useState
var lastShown = dayjs();

const getNextEvent = (events) => {
  const currentEvent = events.find((event) => {
    if (dayjs(event.from).isBefore(dayjs()) && dayjs(event.to).isAfter(dayjs()))
      return event;
  });
  if (currentEvent) return currentEvent;
  try {
    const nextEvent = events
      .sort((a, b) => dayjs(a.from).isBefore(dayjs(b.from)))
      .filter((event) => dayjs(event.from).isAfter(dayjs()))[0];
    return nextEvent;
  } catch (e) {
    console.log(e);
    return false;
  }
};

function App() {
  const [geoJson, setGeoJson] = useState(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  // voice command state
  const [personOfInterestName, setPersonOfInterestName] = useState(null);

  const commands = [
    {
      command: "Where is :name",
      callback: async (name) => {
        const { identifier } = await locatePerson(name); // make this async
        console.log("person found in poi", identifier);
        if (!identifier) {
          setMessages([
            ...messages,
            { text: `Where is ${name}`, from: "user" },
            { text: `Sorry I could not find ${name}`, from: "bot" },
          ]);
        }
        setMessages([
          ...messages,
          { text: `Where is ${name}`, from: "user" },
          { text: `${name} is in`, from: "bot", location: identifier },
          {
            text: `Do you want me to start a navigation to ${name}?`,
            from: "bot",
          },
        ]);
        setPersonOfInterestName(name);
      },
    },
    // {
    //   command: "Locate :name",
    //   callback: (name) => {
    //     // const location = await getPersonLocation(person);
    //     // setNextDestination(location);
    //     setMessages([...messages, { text: `Locate ${name}`, from: "user" }]);
    //     console.log(`Recog: Locate ${name}`);
    //   },
    // },
    // {
    //   command: "where's :name",
    //   callback: (name) => {
    //     // const location = await getPersonLocation(person);
    //     // setNextDestination(location);
    //     setMessages([...messages, { text: `Where's ${name}`, from: "user" }]);
    //     console.log(`Recog: where's ${name}`);
    //   },
    // },
    {
      command: ["Yes", "Fuck yeah"],
      callback: async () => {
        console.log("yes");
        // make this conditional on bot asking a question
        if (personOfInterestName) {
          console.log("yes inside");

          setMessages([
            ...messages,
            { text: `Yes`, from: "user" },
            {
              text: `Ok I've started the navigation to ${personOfInterestName}`,
              from: "bot",
            },
          ]);
          await meetWithPerson(personOfInterestName, user.userName);
          setTimeout(() => {
            scroller.scrollTo("start", {
              duration: 800,
              delay: 0,
              smooth: "easeInOutQuart",
              offset: -300,
            });
          }, 1500);
        }
      },
    },
  ];

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition({ commands });

  //update the timestamp for the last transript update
  useEffect(() => {
    lastShown = dayjs();
  }, [transcript]);

  //  delete transcript if its older than 1.2 seconds
  useEffect(() => {
    scroller.scrollTo("start", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      offset: -300,
    });
    setInterval(() => {
      if (dayjs().diff(lastShown, "second") > 1) resetTranscript();
    }, 3000);
  }, [resetTranscript]);

  useEffect(() => {
    resetTranscript();
    if (messages.length > 0) {
      scroller.scrollTo("chat", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    }
  }, [messages, resetTranscript]);

  const nextEvent = user && user.schedule ? getNextEvent(user.schedule) : null;

  if (!browserSupportsSpeechRecognition) {
    return <div>Not supported</div>;
  }

  SpeechRecognition.startListening({ continuous: true });

  // const nextEvent = user && user.schedule[0];
  console.log(user);

  return (
    <div className="bg-slate-50 min-h-screen text-stone-700 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-2/5">
        <Element name="start" className="element" />
        <UserContext.Provider value={{ user, setUser }}>
          <NavContext.Provider value={{ geoJson, setGeoJson }}>
            <WebcamCapture />
            {!user && <Recognize />}
            {user && (
              <React.Fragment>
                <div className="flex flex-row w-full items-center justify-between ">
                  <div className="text-3xl mt-4 mb-4">
                    Hello {user && user.userName}
                  </div>
                  <Card className="mt-4 mb-4 self-end opacity-90 self-end">
                    <SpeechInput className="flex flex-row items-center">
                      {transcript ? (
                        <ReactLoading
                          type={"bubbles"}
                          color={"#44403C"}
                          height={"25px"}
                          width={"25px"}
                        />
                      ) : (
                        "🎤 "
                      )}
                      <div className="text-xl ml-4 max-w-[11rem] truncate">
                        {transcript ? transcript : "Start talking"}
                      </div>
                    </SpeechInput>
                  </Card>
                </div>
                <Schedule nextEvent={nextEvent} schedule={user.schedule} />
                {nextEvent && nextEvent !== false && (
                  <React.Fragment>
                    <Directions nextEvent={nextEvent} />
                    <Map destination={nextEvent} poid={nextEvent.poid} />
                  </React.Fragment>
                )}
                <Chat messages={messages} latestTranscript={transcript} />
              </React.Fragment>
            )}
          </NavContext.Provider>
        </UserContext.Provider>
      </div>
    </div>
  );
}

export default App;
