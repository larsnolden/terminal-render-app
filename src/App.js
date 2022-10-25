import React, { useEffect } from "react";
import { useState, createContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./App.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Link,
  DirectLink,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";

import Recognize from "./views/Recognize";
import Schedule from "./views/Schedule";
import Chat from "./views/Chat";

import demoData from "./DemoData";

export const NavContext = createContext(null);
dayjs.extend(relativeTime);

//  dirty global variable
//  setInterval does not use the latest of useState
var lastShown = dayjs();

const locatePerson = (name) => ({ location: "OH123 " });

function App() {
  const [currentView, setCurrentView] = useState("chat");
  const [geoJson, setGeoJson] = useState(null);
  const [messages, setMessages] = useState([]);

  const commands = [
    {
      command: "Where is :name",
      callback: (name) => {
        const { location } = locatePerson(name); // make this async
        setMessages([
          ...messages,
          { text: `Where is ${name}`, from: "user" },
          { text: `${name} is in`, from: "bot", location },
        ]);
        console.log(`Recog: Where is ${name}`);
      },
    },
    {
      command: "Locate :name",
      callback: (name) => {
        // const location = await getPersonLocation(person);
        // setNextDestination(location);
        setMessages([...messages, { text: `Locate ${name}`, from: "user" }]);
        console.log(`Recog: Locate ${name}`);
      },
    },
    {
      command: "where's :name",
      callback: (name) => {
        // const location = await getPersonLocation(person);
        // setNextDestination(location);
        setMessages([...messages, { text: `Where's ${name}`, from: "user" }]);
        console.log(`Recog: where's ${name}`);
      },
    },
  ];

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition({ commands });

  //update the timestamp for the last transript update
  useEffect(() => {
    lastShown = dayjs();
    scroller.scrollTo("chat", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  }, [transcript]);

  //  delete transcript if its older than 1.2 seconds
  useEffect(() => {
    scroller.scrollTo("start", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
    setInterval(() => {
      if (dayjs().diff(lastShown, "second") > 1) resetTranscript();
    }, 3000);
  }, []);

  useEffect(() => {
    resetTranscript();
  }, [messages]);

  if (!browserSupportsSpeechRecognition) {
    return <div>Not supported</div>;
  }

  SpeechRecognition.startListening({ continuous: true });
  console.log(transcript);

  return (
    <div className="bg-slate-50 min-h-screen text-stone-700 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-2/5">
        <Element name="start" className="element" />
        <div className="text-3xl mt-4 mb-4">Hello {demoData.name}</div>
        <NavContext.Provider value={{ geoJson, setGeoJson }}>
          {currentView === "recognize" && <Recognize />}
          {/* {currentView === "schedule" && ( */}
          <Schedule personName={demoData.name} schedule={demoData.schedule} />
          {/* )} */}
          {/* {currentView === "chat" && ( */}
          <Chat
            personName={demoData.name}
            messages={messages}
            latestTranscript={transcript}
          />
          {/* )} */}
        </NavContext.Provider>
      </div>
    </div>
  );
}

export default App;
