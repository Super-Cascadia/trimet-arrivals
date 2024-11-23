import * as turf from "@turf/turf";
import { Map } from "mapbox-gl";

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

export function setCurrentLocationMarker(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number
) {
  console.log("setting current location marker");
  map.addSource("currentLocationCircle", {
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
    id: "currentLocationCircleLayer",
    type: "circle",
    source: "currentLocationCircle"
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
