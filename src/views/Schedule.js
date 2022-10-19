import React from "react";
import dayjs from "dayjs";

import Card from "../components/Card";

const ScheduleColumn = ({ time }) => (
  <div className="flex flex-row border-b-2 mb-2 pb-1 border-slate-300">
    {time}
  </div>
);

const EventItem = ({ from, to, eventName }) => (
  <div className="absolute bg-orange-600 ml-10">{eventName}</div>
);

//  hours the calendar is shown for
//  make these full dayjs items (must include date) to check if event is at one of these instances
const calendarHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) =>
  dayjs().hour(hour).minute(0).second(0)
);

const Schedule = ({ personName, schedule }) => (
  <div className="min-h-screen">
    <div className="text-2xl">Hello {personName}</div>
    <div className="flex items-center justify-center">
      <Card className="w-1/3">
        <div className="flex flex-col">
          <div className="text-4xl">{dayjs().format("ddd D. MMM")}</div>
          <div className="pt-4 relative">
            {calendarHours.map((dateAndTime) => (
              <div>
                <ScheduleColumn time={dayjs(dateAndTime).format("HH:mm")} />
                {/* {schedule[0].eventName} */}
                {/* {
                  schedule.filter(
                    (event) =>
                      dayjs(event.from).isAfter(dateAndTime) &&
                      !dayjs(event.to).isBefore(dateAndTime)
                  ).length */}
                {schedule.filter(
                  (event) =>
                    dayjs(event.from).isAfter(dateAndTime) &&
                    !dayjs(event.to).isBefore(dateAndTime)
                ).length > 0 && (
                  <EventItem
                    eventName={
                      schedule.filter(
                        (event) =>
                          dayjs(event.from).isAfter(dateAndTime) &&
                          !dayjs(event.to).isBefore(dateAndTime)
                      )[0].eventName
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default Schedule;
