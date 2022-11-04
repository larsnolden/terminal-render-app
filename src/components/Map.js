import React, { useContext, useEffect, useState } from "react";
import "./Map.css";
import { MazeMapWrapper } from "./MazeMapWrapper";
import { NavContext } from "../App";
import Pill from "./Pill";
import Card from "./Card";

const pitchRotationLookingDirection = 40;

function makeMazeMapInstance() {
  const mazemapRoot = document.createElement("div");
  mazemapRoot.className = "mazemap-root";
  const mapOptions = {
    container: mazemapRoot,
    campuses: "default",
    center: { lng: 6.8609919, lat: 52.2370638 },
    zoom: 20,
    zLevel: 1,
    bearing: -59,
    pitch: pitchRotationLookingDirection,
    zLevelControl: false,
    zLevelUpdater: false,
    scrollZoom: false,
    doubleClickZoom: false,
    touchZoomRotate: false,
  };

  // eslint-disable-next-line no-undef
  return new Mazemap.Map(mapOptions);
}

function Map({ destination, poid }) {
  const { setGeoJson } = useContext(NavContext);
  const [map, setMap] = useState(null);
  const [routeController, setRouteController] = useState(null);

  useEffect(() => {
    setMap(makeMazeMapInstance());
  }, []);

  useEffect(() => {
    if (map) {
      map.on("load", function () {
        console.log("map loaded");

        // eslint-disable-next-line no-undef
        var destinationMarkerOptions = new Mazemap.MazeMarker({
          glyphColor: "#FFF",
          glyphSize: 25,
          glyph: "🏁", //Could even be an emoji, such as '🖨'
        });

        // eslint-disable-next-line no-undef
        var routeController = new Mazemap.RouteController(map, {
          routeLineColorPrimary: "#4ade80",
          routeLineColorSecondary: "#4da86f",
        });

        setRouteController(routeController);
      });
    }

    function setRoute(start, dest) {
      routeController.clear(); // Clear existing route, if any

      // eslint-disable-next-line no-undef
      Mazemap.Data.getRouteJSON(start, dest).then(function (geojson) {
        routeController.setPath(geojson);

        // eslint-disable-next-line no-undef
        var bounds = Mazemap.Util.Turf.bbox(geojson);
        map.fitBounds(bounds, { padding: 100 });

        setGeoJson(geojson);
        // console.log("startLatLng", startLatLng, "endLatLng", endLatLng);

        //set destination marker
        // eslint-disable-next-line no-undef
        // var marker = new Mazemap.MazeMarker(destinationMarkerOptions)
        //   .setLngLat(destLatLang)
        //   .addTo(map);
      });
    }

    if (routeController) {
      setRoute(
        {
          poiId: process.env.REACT_APP_START_POID,
        },
        { poiId: destination.poid }
      );
    }
  }, [map, destination, setGeoJson, poid]);

  // console.log(destination);
  return (
    <Card className="mt-8 mb-4 w-full">
      <div className="flex flex-row mb-2">
        <div className="text-3xl">Directions to</div>
        <Pill color="blue" className="ml-4 font-semibold">
          {destination.location}
        </Pill>
      </div>
      <div className="relative h-80 mt-4 map">
        {map && <MazeMapWrapper map={map} />}
      </div>
    </Card>
  );
}

export default Map;
