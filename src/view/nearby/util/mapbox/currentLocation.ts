import * as turf from "@turf/turf";
import { Map } from "mapbox-gl";
import { CURRENT_LOCATION_CIRCLE, CURRENT_LOCATION_CIRCLE_LAYER, CURRENT_LOCATION_RADIUS, CURRENT_LOCATION_RADIUS_LAYER } from "./consts";

export function drawCircle(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
): Map {
  const center = [lng, lat];
  const radius = radiusSize;
  const options = { steps: 26, units: "feet", properties: { foo: "bar" } };
  // @ts-ignore
  const circle = turf.circle(center, radius, options);

  map.addSource(CURRENT_LOCATION_RADIUS, {
    type: "geojson",
    data: circle
  });

  const updatedMap = map.addLayer({
    id: CURRENT_LOCATION_RADIUS_LAYER,
    type: "fill",
    source: CURRENT_LOCATION_RADIUS,
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.4
    }
  });
  
  return updatedMap;
}

export function setCurrentLocationMarker(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
): Map {
  console.log("setting current location marker");
  map.addSource(CURRENT_LOCATION_CIRCLE, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      }
    }
  });

  map.addLayer({
    id: CURRENT_LOCATION_CIRCLE_LAYER,
    type: "circle",
    source: CURRENT_LOCATION_CIRCLE
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
    console.log("initializing current location marker");
    updatedMap = setCurrentLocationMarker(map, lng, lat, radiusSize);
  });

  return updatedMap;
}
