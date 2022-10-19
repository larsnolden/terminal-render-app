import { useState } from "react";
import "./App.css";

import Recognize from "./views/Recognize";
import Schedule from "./views/Schedule";

import demoData from "./DemoData";

function App() {
  const [currentView, setCurrentView] = useState("schedule");

  setTimeout(() => {
    // setCurrentView("schedule");
  }, 2000);

  return (
    <div className="bg-slate-50 min-h-screen">
      {currentView === "recognize" && <Recognize />}
      {currentView === "schedule" && (
        <Schedule personName={demoData.name} schedule={demoData.schedule} />
      )}
    </div>
  );
}

export default App;
