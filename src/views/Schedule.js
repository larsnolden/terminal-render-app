import React, { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";

import { EventItem, CurrentTime } from "../components/EventItem";
import Card from "../components/Card";

const ScheduleColumn = ({ time }) => (
  <div className="flex flex-row border-b mb-2 pb-1 border-slate-300 font-light text-lg">
    {time}
  </div>
);
//  hours the calendar is shown for
//  make these full dayjs items (must include date) to check if event is at one of these instances
const calendarHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) =>
  dayjs().hour(hour).minute(0).second(0)
);

const Schedule = ({ schedule, nextEvent }) => {
  const calendarRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);

  useEffect(() => {
    setCalendarHeight(calendarRef.current.clientHeight);
  }, []);

  const verticalPixelPerMinute = calendarHeight / (calendarHours.length * 60);

  return (
    <div className="w-full">
      <Card>
        <div className="flex flex-col">
          <div className="text-4xl">{dayjs().format("ddd D. MMM")}</div>
          <div className="pt-4 relative" ref={calendarRef}>
            {calendarHours.map((dateAndTime) => (
              <ScheduleColumn time={dayjs(dateAndTime).format("HH:mm")} />
            ))}
            {schedule.map((event) => (
              <EventItem
                {...event}
                calendarHours={calendarHours}
                verticalPixelPerMinute={verticalPixelPerMinute}
              />
            ))}
            <CurrentTime
              calendarHours={calendarHours}
              verticalPixelPerMinute={verticalPixelPerMinute}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Schedule;
