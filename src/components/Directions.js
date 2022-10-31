import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import Card from "./Card";
import Pill from "./Pill";

import { NavContext } from "../App";

import ArrowRightPath from "../assets/arrow-right.png";
import ArrowLeftPath from "../assets/arrow-left.png";
import ArrowStraightPath from "../assets/arrow-straight.png";

const getDirectionsURL = (originLatLng, destLatLang) =>
  `https://routing.mazemap.com/routing/directions/?srid=4326&hc=false&sourcelat=${originLatLng[1]}&sourcelon=${originLatLng[0]}&targetlat=${destLatLang[1]}&targetlon=${destLatLang[0]}&sourcez=1&targetz=1&lang=en&distanceunitstype=metric&mode=PEDESTRIAN`;

const getNavigationActionablesReg = new RegExp(/\d* meters|right|left/gm);

const Directions = ({ nextEvent }) => {
  const { geoJson } = useContext(NavContext);
  const [directions, setDirections] = useState(null);
  useEffect(() => {
    if (geoJson) {
      const coordinates = geoJson.features[0].geometry.coordinates;
      const originLatLng = [
        process.env.REACT_APP_TERMINAL_INSTALL_LON,
        process.env.REACT_APP_TERMINAL_INSTALL_LAT,
      ];
      const destLatLang = coordinates[coordinates.length - 1];
      axios
        .get(getDirectionsURL(originLatLng, destLatLang))
        .then((res) => setDirections(res.data.routes[0].legs[0].steps));
    }
  }, [geoJson]);

  const navigationActionables = directions
    ? directions
        .map((a) => a.instruction)
        .join(" ")
        .match(getNavigationActionablesReg)
    : null;

  return (
    <Card className="mt-8 w-full">
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
  );
};

export default Directions;
