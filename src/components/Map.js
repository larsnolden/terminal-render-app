import React, { useContext } from "react";
import "./Map.css";
import { MazeMapWrapper } from "./MazeMapWrapper";
import { MapContext } from "../App";

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
  const map = new Mazemap.Map(mapOptions);
  // For debugging, it helps to add the map to global window
  // to quickly access methods like window.mazemapinstance.getZoom(), etc.
  // window.mazemapinstance = map;

  map.on("load", function () {
    console.log("map loaded");
    // eslint-disable-next-line no-undef
    // const blueDot = new Mazemap.BlueDot({
    //   map: map,
    // })
    //   .setLngLat({ lng: 6.8609919, lat: 52.2370638 })
    //   .setZLevel(1)
    //   .setAccuracy(10)
    //   .show();

    // eslint-disable-next-line no-undef
    var routeController = new Mazemap.RouteController(map);

    function setRoute(start, dest) {
      console.log("set Route");

      routeController.clear(); // Clear existing route, if any

      // eslint-disable-next-line no-undef
      Mazemap.Data.getRouteJSON(start, dest).then(function (geojson) {
        // var ctx = useContext(MapContext);
        console.log("ctx", MapContext);
        window.geoJson = geojson;

        routeController.setPath(geojson);
        // eslint-disable-next-line no-undef
        var bounds = Mazemap.Util.Turf.bbox(geojson);
        map.fitBounds(bounds, { padding: 100 });
      });
    }

    setRoute({ poiId: 854735 }, { poiId: 854932 });
  });

  return map;
}

// Make a "global" map instance to use throughout the app lifetime
// and pass it around to components that need to interact with it

function Map({ destination, origin }) {
  const map = makeMazeMapInstance();
  const { setGeoJson } = useContext(MapContext);
  setGeoJson(window.geoJson);
  return (
    <div className="Map">
      <MazeMapWrapper map={map}></MazeMapWrapper>
    </div>
  );
}

export default Map;
