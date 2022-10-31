import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import Pill from "./Pill";

const HeightContainer = styled.div`
  height: ${(props) => props.height}px;
  bottom: ${(props) => props.bottomOffset}px;
  margin-left: 50px;
`;

const TimeText = styled.div`
  bottom: ${(props) => props.bottomOffset}px;
  right: 0;
`;

const Circle = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  bottom: ${(props) => props.bottomOffset}px;
  margin-left: 36px;
`;

const EventItem = ({
  from,
  to,
  eventName,
  location,
  verticalPixelPerMinute,
  calendarHours,
}) => {
  const height =
    dayjs(to).diff(dayjs(from), "minutes") * verticalPixelPerMinute;
  const offset =
    dayjs(calendarHours[calendarHours.length - 1]).diff(dayjs(to), "minutes") *
    verticalPixelPerMinute;

  return (
    <HeightContainer
      bottomOffset={offset}
      height={height}
      className="absolute drop-shadow-md font-semibold text-emerald-900 rounded-lg p-4 bg-green-400 flex flex-row justify-between w-4/5"
    >
      <div className="relative w-8/12">{eventName}</div>
      <Pill color="blue">{location}</Pill>
    </HeightContainer>
  );
};

const CurrentTime = ({ verticalPixelPerMinute, calendarHours }) => {
  const height = verticalPixelPerMinute * 3;
  const offset =
    dayjs(calendarHours[calendarHours.length - 1]).diff(dayjs(), "minutes") *
    verticalPixelPerMinute;
  return (
    <React.Fragment>
      <HeightContainer
        bottomOffset={offset}
        height={height}
        className="absolute drop-shadow-md rounded-lg bg-red-400 w-10/12"
      />
      <Circle
        bottomOffset={offset - 6}
        className="bg-red-400 absolute drop-shadow-md"
      />
      <TimeText
        bottomOffset={offset - 8}
        className="absolute text-red-400 font-bold text-xl"
      >
        {dayjs().format("HH:mm")}
      </TimeText>
    </React.Fragment>
  );
};

export { EventItem, CurrentTime };
