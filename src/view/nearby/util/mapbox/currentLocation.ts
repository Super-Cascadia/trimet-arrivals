import * as turf from "@turf/turf";
import { Map } from "mapbox-gl";
import { CURRENT_LOCATION_CIRCLE, CURRENT_LOCATION_CIRCLE_LAYER, CURRENT_LOCATION_RADIUS, CURRENT_LOCATION_RADIUS_LAYER } from "./consts";

export function drawCircle(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
) {
  const center = [lng, lat];
  const radius = radiusSize;
  const options = { steps: 26, units: "feet", properties: { foo: "bar" } };
  // @ts-ignore
  const circle = turf.circle(center, radius, options);

  map.addSource(CURRENT_LOCATION_RADIUS, {
    type: "geojson",
    data: circle
  });

  map.addLayer({
    id: CURRENT_LOCATION_RADIUS_LAYER,
    type: "fill",
    source: CURRENT_LOCATION_RADIUS,
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.4
    }
  });
}

export function setCurrentLocationMarker(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
) {
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

  drawCircle(map, lng, lat, radiusSize);
}

export function initializeCurrentLocationMarker(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
) {
  map.on("load", () => {
    console.log("initializing current location marker");
    setCurrentLocationMarker(map, lng, lat, radiusSize);
  });
}
