import React, { useContext, useEffect, useState } from "react";
import "./Map.css";
import { MazeMapWrapper } from "./MazeMapWrapper";
import { NavContext } from "../App";

const pitchRotationLookingDirection = 40;

function makeMazeMapInstance(setGeoJson) {
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

  // map.on("load", function () {
  //   console.log("map loaded");
  //   // eslint-disable-next-line no-undef
  //   // const blueDot = new Mazemap.BlueDot({
  //   //   map: map,
  //   // })
  //   //   .setLngLat({ lng: 6.8609919, lat: 52.2370638 })
  //   //   .setZLevel(1)
  //   //   .setAccuracy(10)
  //   //   .show();

  //   // eslint-disable-next-line no-undef
  //   var routeController = new Mazemap.RouteController(map);

  //   function setRoute(start, dest) {
  //     console.log("set Route");

  //     routeController.clear(); // Clear existing route, if any

  //     // eslint-disable-next-line no-undef
  //     Mazemap.Data.getRouteJSON(start, dest).then(function (geojson) {
  //       setGeoJson(geojson);
  //       console.log("ctx", NavContext);

  //       routeController.setPath(geojson);
  //       // eslint-disable-next-line no-undef
  //       var bounds = Mazemap.Util.Turf.bbox(geojson);
  //       map.fitBounds(bounds, { padding: 100 });
  //     });
  //   }

  //   setRoute(
  //     {
  //       lngLat: {
  //         lat: process.env.REACT_APP_TERMINAL_INSTALL_LAT,
  //         lng: process.env.REACT_APP_TERMINAL_INSTALL_LON,
  //       },
  //       zLevel: 1, // required floor level indicator
  //     },
  //     { poiId: 854735 }
  //   );
  // });
  console.log("lat", process.env.REACT_APP_TERMINAL_INSTALL_LAT);
  return map;
}

// Make a "global" map instance to use throughout the app lifetime
// and pass it around to components that need to interact with it

function Map({ destinationPoid }) {
  const { setGeoJson } = useContext(NavContext);
  const [map, setMap] = useState(null);

  useEffect(() => {
    setMap(makeMazeMapInstance(setGeoJson));
  }, []);

  useEffect(() => {
    if (map) {
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

        function setRoute(start, dest) {
          console.log("set Route");

          routeController.clear(); // Clear existing route, if any

          // eslint-disable-next-line no-undef
          Mazemap.Data.getRouteJSON(start, dest).then(function (geojson) {
            setGeoJson(geojson);
            console.log("ctx", NavContext);

            routeController.setPath(geojson);
            // eslint-disable-next-line no-undef
            var bounds = Mazemap.Util.Turf.bbox(geojson);
            map.fitBounds(bounds, { padding: 100 });

            //set destination marker
            const coordinates = geojson.features[0].geometry.coordinates;
            const destLatLang = coordinates[coordinates.length - 1];

            // eslint-disable-next-line no-undef
            var marker = new Mazemap.MazeMarker(destinationMarkerOptions)
              .setLngLat(destLatLang)
              .addTo(map);
          });
        }

        setRoute(
          {
            lngLat: {
              lat: process.env.REACT_APP_TERMINAL_INSTALL_LAT,
              lng: process.env.REACT_APP_TERMINAL_INSTALL_LON,
            },
            zLevel: 1, // required floor level indicator
          },
          { poiId: destinationPoid }
        );
      });
    }
  }, [map]);

  return (
    <div className="Map">
      {map && <MazeMapWrapper map={map}></MazeMapWrapper>}
    </div>
  );
}

export default Map;
