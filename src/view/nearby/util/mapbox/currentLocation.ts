import circle from "@turf/circle";
import { Map } from "mapbox-gl";
import {
  CURRENT_LOCATION_CIRCLE,
  CURRENT_LOCATION_CIRCLE_LAYER,
  CURRENT_LOCATION_RADIUS,
  CURRENT_LOCATION_RADIUS_LAYER
} from "./consts";

export function drawCircle(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
): Map {
  const radiusCircle = circle([lng, lat], radiusSize, {
    properties: { foo: "bar" },
    steps: 26,
    units: "feet"
  });

  map.addSource(CURRENT_LOCATION_RADIUS, {
    data: radiusCircle,
    type: "geojson"
  });

  const updatedMap = map.addLayer({
    id: CURRENT_LOCATION_RADIUS_LAYER,
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.4
    },
    source: CURRENT_LOCATION_RADIUS,
    type: "fill"
  });

  return updatedMap;
}

export function setCurrentLocationMarker(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
): Map {
  map.addSource(CURRENT_LOCATION_CIRCLE, {
    data: {
      geometry: {
        coordinates: [lng, lat],
        type: "Point"
      },
      properties: {},
      type: "Feature"
    },
    type: "geojson"
  });

  map.addLayer({
    id: CURRENT_LOCATION_CIRCLE_LAYER,
    source: CURRENT_LOCATION_CIRCLE,
    type: "circle"
  });

  return drawCircle(map, lng, lat, radiusSize);
}

export function initializeCurrentLocationMarker(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
) {
  let updatedMap = map;
  map.on("load", () => {
    updatedMap = setCurrentLocationMarker(map, lng, lat, radiusSize);
  });

  return updatedMap;
}
