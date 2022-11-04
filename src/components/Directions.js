import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import Card from "./Card";
import Pill from "./Pill";

import { NavContext } from "../App";

import ArrowRightPath from "../assets/arrow-right.png";
import ArrowLeftPath from "../assets/arrow-left.png";
import ArrowStraightPath from "../assets/arrow-straight.png";
import UpstairsPath from "../assets/upstairs.png";
import DownstairsPath from "../assets/downstairs.png";

const getDirectionsURL = (originLatLng, destLatLng, originZ, destZ) =>
  `https://routing.mazemap.com/routing/directions/?srid=4326&hc=false&sourcelat=${originLatLng[1]}&sourcelon=${originLatLng[0]}&targetlat=${destLatLng[1]}&targetlon=${destLatLng[0]}&sourcez=${originZ}&targetz=${destZ}&lang=en&distanceunitstype=metric&mode=PEDESTRIAN`;

const getNavigationActionablesReg = new RegExp(
  /\d* meters|right|left|staircase up to floor \d|staricase down to floor \d/gm
);

const Directions = ({ nextEvent }) => {
  const { geoJson } = useContext(NavContext);
  const [directions, setDirections] = useState(null);
  useEffect(() => {
    if (geoJson) {
      const startLatLng = geoJson.features[0].geometry.coordinates[0];
      const destFeature = geoJson.features[geoJson.features.length - 1];
      const destLatLng =
        destFeature.geometry.coordinates[
          destFeature.geometry.coordinates.length - 1
        ];
      const originZ = geoJson.features[0].properties.z;
      const destZ = destFeature.properties.z;

      axios
        .get(getDirectionsURL(startLatLng, destLatLng, originZ, destZ))
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
            if (action === "right") {
              text = "Turn right";
              imgPath = ArrowRightPath;
            } else if (action === "left") {
              text = "Turn left";
              imgPath = ArrowLeftPath;
            } else if (String(action).includes("meters")) {
              imgPath = ArrowStraightPath;
              text = action;
            } else if (String(action).includes("up")) {
              imgPath = UpstairsPath;
              text = action;
            } else if (String(action).includes("down")) {
              imgPath = DownstairsPath;
              text = action.toUpperCase;
            }
            return (
              <div className="flex flex-row items-center font-bold text-xl mt-6">
                <img
                  alt="direction"
                  className="w-12 mr-4 capitalize"
                  src={imgPath}
                />
                {text}
              </div>
            );
          })}
      </div>
    </Card>
  );
};

export default Directions;
