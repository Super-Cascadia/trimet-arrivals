// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl, { Map } from "!mapbox-gl";
import * as turf from "@turf/turf";
import { forEach, isEqual, isString, set, uniq } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import { setCurrentLocationMarker } from "../util/currentLocationMarker.util";
import { setRoutes } from "../util/mapboxUtils";
import {
  removeStopLocationLayers,
  setNearbyStops
} from "../util/stopLocationMarker.util";

export type LatLngCoords = number[];

const style = {
  height: 800,
  position: "relative",
  width: "100%"
};

function removeRouteLayers(map, routeLayers: any[]) {
  // console.log("removing route layers", routeLayers);
  forEach(uniq(routeLayers), layerId => {
    map.removeLayer(layerId);
    map.removeSource(layerId);
  });
}

function getMapLongitude(map) {
  return map.current.getCenter().lng.toFixed(4);
}

function getMapLatitude(map) {
  return map.current.getCenter().lat.toFixed(4);
}

function initializeMap(
  lng: number,
  lat: number,
  mapContainer: React.MutableRefObject<null>,
  zoom: number
): Map {
  return new mapboxgl.Map({
    center: [lng, lat],
    container: mapContainer.current,
    style: "mapbox://styles/mapbox/streets-v11",
    zoom
  });
}

function drawCircle(map, lng, lat, radiusSize) {
  let center = [lng, lat];
  let radius = radiusSize;
  let options = { steps: 10, units: "feet", properties: { foo: "bar" } };
  // @ts-ignore
  let circle = turf.circle(center, radius, options);

  map.addSource("currentLocationRadius", {
    type: "geojson",
    data: circle
  });

  map.addLayer({
    id: "currentLocationRadiusLayer",
    type: "fill",
    source: "currentLocationRadius",
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.4
    }
  });
}

function initializeCurrentLocationMarker(map, lng, lat, radiusSize) {
  map.current.on("load", () => {
    map.current.addSource("currentLocationCircle", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat]
        }
      }
    });

    map.current.addLayer({
      id: "currentLocationCircleLayer",
      type: "circle",
      source: "currentLocationCircle"
    });

    drawCircle(map.current, lng, lat, radiusSize);
  });
}

interface Props {
  radiusSize: number;
  currentLocation: LatLngCoords;
  stopLocations: StopLocationsDictionary;
  nearbyRouteIds: NearbyRoutesDictionary;
  handleStopmarkerClick: (data: any) => void;
}

function NearbyMapV2({
  currentLocation,
  stopLocations,
  nearbyRouteIds,
  radiusSize,
  handleStopmarkerClick
}: Props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(currentLocation[0]);
  const [lat, setLat] = useState(currentLocation[1]);
  const [zoom, setZoom] = useState(16);
  const [stopLocationIdsState, setStopLocationIdsState] = useState(
    Object.keys(stopLocations)
  );
  const [routeIdsState, setRouteIdsState] = useState(
    Object.keys(nearbyRouteIds)
  );
  const [routeLayers, setRouteLayers] = useState([]);

  const stopLocationIdProps = Object.keys(stopLocations);
  const routeIdProps = Object.keys(nearbyRouteIds);
  const stopLocationIdsAreSame = isEqual(
    stopLocationIdProps,
    stopLocationIdsState
  );
  const routeIdsAreSame = isEqual(routeIdProps, routeIdsState);

  // Initialize Map
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

    // initialize map only once
    console.log("initialize map", lng, lat, zoom);
    map.current = initializeMap(lng, lat, mapContainer, zoom);
    // setCurrentLocationMarker(map.current, currentLocation);
    initializeCurrentLocationMarker(map, lng, lat, radiusSize);
  }, []);

  // initialize currentLocation
  useEffect(() => {
    if (!map.current) {
      return;
    }
    map.current.on("load", () => {
      console.info("effect: set current location marker");
    });
  }, [currentLocation]);

  // Initialize map routes and markers
  useEffect(() => {
    if (!map.current) {
      return;
    }

    map.current.on("load", () => {
      console.info("effect: initialize map markers and routes");

      setNearbyStops(map.current, stopLocations, handleStopmarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
    });
  }, []);

  // Update Map Markers
  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (stopLocationIdsAreSame === false) {
      console.info("effect: update map markers", stopLocations);

      removeStopLocationLayers(map.current);
      setNearbyStops(map.current, stopLocations, handleStopmarkerClick);
      setStopLocationIdsState(Object.keys(stopLocations));
    }
  }, [radiusSize, stopLocations]);

  // Update Map Routes
  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (routeIdsAreSame === false) {
      console.info("effect: update map routes", nearbyRouteIds);
      removeRouteLayers(map.current, routeLayers);
      setRouteLayers([]);
    }
  }, [radiusSize, nearbyRouteIds]);

  // Radius Size Change
  useEffect(() => {
    if (!map.current) {
      return;
    }

    console.log("radius size change", radiusSize);
    const radius = isString(radiusSize) ? parseInt(radiusSize, 10) : radiusSize;

    switch (radius) {
      case 250:
        setZoom(19);
        map.current.setZoom(19);
        break;
      case 500:
        setZoom(18);
        map.current.setZoom(18);
        break;
      case 750:
        setZoom(17);
        map.current.setZoom(17);
        break;
      case 1000:
        setZoom(16);
        map.current.setZoom(16);
        break;
      case 1500:
        setZoom(15);
        map.current.setZoom(15);
        break;
      case 2000:
        setZoom(14);
        map.current.setZoom(14);
        break;
      case 2500:
        setZoom(13);
        map.current.setZoom(13);
        break;
      case 5000:
        setZoom(12);
        map.current.setZoom(12);
        break;
      default:
        setZoom(16);
        map.current.setZoom(16);
    }

    // map.current.on("load", () => {
    //   map.current.setPaintProperty('currentLocationCircleLayer', 'circle-radius', 100);
    // });
  }, [radiusSize]);

  // @ts-ignore
  const mapBoxMap = <div style={style} ref={mapContainer} />;

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      {mapBoxMap}
    </div>
  );
}

export default NearbyMapV2;
