import React, { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import Card from "../components/Card";
import Pill from "../components/Pill";
import Map from "../components/Map";
import Direction from "../components/Direction";

const HeightContainer = styled.div`
  height: ${(props) => props.height}px;
  bottom: ${(props) => props.bottomOffset}px;
  left: 50px;
`;

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

const EventItem = ({
  from,
  to,
  eventName,
  location,
  verticalPixelPerMinute,
}) => {
  const height =
    dayjs(to).diff(dayjs(from), "minutes") * verticalPixelPerMinute;
  const offset =
    dayjs(calendarHours[calendarHours.length - 1]).diff(dayjs(to), "minutes") *
    verticalPixelPerMinute;

  console.log(offset);
  return (
    <HeightContainer
      bottomOffset={offset}
      height={height}
      className="absolute drop-shadow-md font-semibold text-emerald-900 rounded-lg p-4 bg-green-400 flex flex-row justify-between"
    >
      <div className="relative w-8/12">{eventName}</div>
      <Pill color="blue">{location}</Pill>
    </HeightContainer>
  );
};

const Schedule = ({ personName, schedule }) => {
  const calendarRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);

  useEffect(() => {
    setCalendarHeight(calendarRef.current.clientHeight);
  }, []);

  const verticalPixelPerMinute = calendarHeight / (calendarHours.length * 60);

  return (
    <div className="min-h-screen">
      <div className="text-2xl">Hello {personName}</div>
      <div className="flex flex-col items-center justify-center">
        <Card className="w-1/3">
          <div className="flex flex-col">
            <div className="text-4xl">{dayjs().format("ddd D. MMM")}</div>
            <div className="pt-4 relative" ref={calendarRef}>
              {calendarHours.map((dateAndTime) => (
                <ScheduleColumn time={dayjs(dateAndTime).format("HH:mm")} />
              ))}
              {schedule.map((event) => (
                <EventItem
                  {...event}
                  verticalPixelPerMinute={verticalPixelPerMinute}
                />
              ))}
            </div>
          </div>
        </Card>
        <Card className="mt-8 relative w-1/3 h-80">
          <Map origin={854735} destination={854932} />
        </Card>
        <Card>
          <Direction />
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
