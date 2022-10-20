import React, { useContext } from "react";

import { MapContext } from "../App";

const Direction = () => {
  const { geoJson } = useContext(MapContext);
  return <div>{geoJson}</div>;
};

export default Direction;
