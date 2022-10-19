import React from "react";
import dayjs from "dayjs";

import Card from "../components/Card";

const ScheduleColumn = ({ time }) => (
  <div className="flex flex-row border-b-2 border-slate-300">{time}</div>
);

const Schedule = ({ personName, schedule }) => (
  <div className="min-h-screen">
    <div className="text-2xl">Hello {personName}</div>
    <div className="flex items-center justify-center">
      <Card>
        <div className="flex flex-col">
          <div className="text-4xl">{dayjs().format("ddd D. MMM")}</div>
        </div>
      </Card>
    </div>
  </div>
);

export default Schedule;
