import React, { useRef, useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import axios from "axios";

import { NavContext } from "../App";
import Card from "../components/Card";
import Pill from "../components/Pill";
import Map from "../components/Map";
import Direction from "../components/Direction";

import ArrowRightPath from "../assets/arrow-right.png";
import ArrowLeftPath from "../assets/arrow-left.png";
import ArrowStraightPath from "../assets/arrow-straight.png";

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

const getNavigationActionablesReg = new RegExp(/\d* meters|right|left/gm);

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

const getNextEvent = (events) =>
  events.length > 1
    ? events.find((event) =>
        events.every(
          (otherEvent) =>
            dayjs(event.from).isBefore(dayjs(otherEvent.from)) ||
            event.from === otherEvent.from
        )
      )
    : events[0];

const getDirectionsURL = (originLatLng, destLatLang) =>
  `https://routing.mazemap.com/routing/directions/?srid=4326&hc=false&sourcelat=${originLatLng[1]}&sourcelon=${originLatLng[0]}&targetlat=${destLatLang[1]}&targetlon=${destLatLang[0]}&sourcez=1&targetz=1&lang=en&distanceunitstype=metric&mode=PEDESTRIAN`;

const Schedule = ({ personName, schedule }) => {
  const { geoJson } = useContext(NavContext);
  const calendarRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [directions, setDirections] = useState(null);
  const nextEvent = getNextEvent(schedule);
  console.log("nextEvent", nextEvent);

  useEffect(() => {
    if (geoJson) {
      const coordinates = geoJson.features[0].geometry.coordinates;
      const originLatLng = [
        process.env.REACT_APP_TERMINAL_INSTALL_LON,
        process.env.REACT_APP_TERMINAL_INSTALL_LAT,
      ];
      const destLatLang = coordinates[coordinates.length - 1];
      console.log("originLatLng", originLatLng, "destLatLang", destLatLang);
      axios
        .get(getDirectionsURL(originLatLng, destLatLang))
        .then((res) => setDirections(res.data.routes[0].legs[0].steps));
    }
  }, [geoJson]);

  useEffect(() => {
    setCalendarHeight(calendarRef.current.clientHeight);
  }, []);

  const verticalPixelPerMinute = calendarHeight / (calendarHours.length * 60);
  const navigationActionables = directions
    ? directions
        .map((a) => a.instruction)
        .join(" ")
        .match(getNavigationActionablesReg)
    : null;
  console.log("navigationActionables", navigationActionables);

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
                verticalPixelPerMinute={verticalPixelPerMinute}
              />
            ))}
          </div>
        </div>
      </Card>
      <Card className="mt-8">
        <div className="flex flex-row mb-2 ">
          <div className="text-3xl">Next steps to</div>
          <Pill color="blue" className="ml-4 font-semibold">
            {nextEvent.location}
          </Pill>
        </div>
        <div className="flex flex-col">
          {navigationActionables &&
            navigationActionables.slice(0, 3).map((action) => {
              let text = "";
              let imgPath = "";
              switch (action) {
                case "right":
                  text = "Turn right";
                  imgPath = ArrowRightPath;
                  break;
                case "left":
                  text = "Turn left";
                  imgPath = ArrowLeftPath;
                  break;
                default:
                  imgPath = ArrowStraightPath;
                  text = action;
              }
              return (
                <div className="flex flex-row items-center font-bold text-xl mt-6">
                  <img alt="direction" className="w-12 mr-4" src={imgPath} />
                  {text}
                </div>
              );
            })}
        </div>
      </Card>
      {/* <Card className="mt-8 w-2/5">
          <div className="flex flex-row mb-2 ">
            <div className="text-3xl">Next step to</div>
            <Pill color="blue" className="ml-4 font-semibold">
              {nextEvent.location}
            </Pill>
          </div>
          {directions && directions[1].instruction}
        </Card> */}
      <Card className="mt-8 mb-4">
        <div className="flex flex-row mb-2 ">
          <div className="text-3xl">Directions to</div>
          <Pill color="blue" className="ml-4 font-semibold">
            {nextEvent.location}
          </Pill>
        </div>
        <div className="relative h-80 mt-4">
          <Map destinationPoid={nextEvent.poid} />
        </div>
        {/* <div className="mt-6">
            {directions &&
              directions.map((direction) => (
                <div className="mt-2">{direction.instruction}</div>
              ))}
          </div> */}
      </Card>
    </div>
  );
};

export default Schedule;
