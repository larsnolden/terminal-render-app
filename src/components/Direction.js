import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { NavContext } from "../App";

const getDirectionsURL = (originLatLng, destLatLang) =>
  `https://routing.mazemap.com/routing/directions/?srid=4326&hc=false&sourcelat=${originLatLng[1]}&sourcelon=${originLatLng[0]}&targetlat=${destLatLang[1]}&targetlon=${destLatLang[0]}&sourcez=1&targetz=1&lang=en&distanceunitstype=metric&mode=PEDESTRIAN`;

const Direction = () => {
  const { geoJson } = useContext(NavContext);
  const [directions, setDirections] = useState(null);
  useEffect(() => {
    if (geoJson) {
      const coordinates = geoJson.features[0].geometry.coordinates;
      const originLatLng = coordinates[0];
      const destLatLang = coordinates[coordinates.length - 1];
      console.log("originLatLng", originLatLng, "destLatLang", destLatLang);
      axios
        .get(getDirectionsURL(originLatLng, destLatLang))
        .then((res) => setDirections(res.data.routes[0].legs[0].steps));
    }
  }, [geoJson]);

  console.log("geoJson", geoJson);
  console.log("directions", directions);
  return;
};

export default Direction;
