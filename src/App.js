import React from "react";
import { useState, createContext } from "react";
import "./App.css";

import Recognize from "./views/Recognize";
import Schedule from "./views/Schedule";

import demoData from "./DemoData";

export const MapContext = createContext(null);

function App() {
  const [currentView, setCurrentView] = useState("schedule");
  const [geoJson, setGeoJson] = useState(null);

  console.log(geoJson);

  setTimeout(() => {
    // setCurrentView("schedule");
  }, 2000);

  return (
    <div className="bg-slate-50 min-h-screen text-stone-700">
      <MapContext.Provider value={{ geoJson, setGeoJson }}>
        {currentView === "recognize" && <Recognize />}
        {currentView === "schedule" && (
          <Schedule personName={demoData.name} schedule={demoData.schedule} />
        )}
      </MapContext.Provider>
    </div>
  );
}

export default App;
