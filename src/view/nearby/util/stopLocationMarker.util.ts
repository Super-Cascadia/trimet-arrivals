import { forEach, map, set, uniq } from "lodash";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import * as turf from "@turf/turf";

interface Geometry {
  coordinates: number[];
  type: string;
}

interface Feature {
  geometry: Geometry;
  type: "Feature";
  properties: {};
}

export function removeRouteLayers(map, routeLayers: any[]) {
  console.log('removing route layers');
  // console.log("removing route layers", routeLayers);
  forEach(uniq(routeLayers), layerId => {
    map.removeLayer(layerId);
    map.removeSource(layerId);
  });
}

export function drawCircle(map, lng, lat, radiusSize) {
  let center = [lng, lat];
  let radius = radiusSize;
  let options = { steps: 26, units: "feet", properties: { foo: "bar" } };
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

export function setCurrentLocationMarker(map, lng, lat, radiusSize) {
  console.log('setting current location marker');
  map.addSource("currentLocationCircle", {
    type: "geojson",
    data: {
      type: "Feature",
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

export function initializeCurrentLocationMarker(map, lng, lat, radiusSize) {
  map.on("load", () => {
    console.log('initializing current location marker');
    setCurrentLocationMarker(map, lng, lat, radiusSize);
  });
}

export function removeStopLocationLayers(mapBoxMap: any) {
  console.log('removing stop location layers');
  if (mapBoxMap.getLayer("stopLocationLayer")) {
    mapBoxMap.removeLayer("stopLocationLayer");
  }

  if (mapBoxMap.getSource("stopLocationsSource")) {
    mapBoxMap.removeSource("stopLocationsSource");
  }
}

export function removeCurrentLocationMarkers(mapBoxMap: any) {
  console.log('removing current location markers');
  if (mapBoxMap.getLayer("currentLocationCircleLayer")) {
    mapBoxMap.removeLayer("currentLocationCircleLayer");
  }

  if (mapBoxMap.getSource("currentLocationCircle")) {
    mapBoxMap.removeSource("currentLocationCircle");
  }

  if (mapBoxMap.getLayer("currentLocationRadiusLayer")) {
    mapBoxMap.removeLayer("currentLocationRadiusLayer");
  }

  if (mapBoxMap.getSource("currentLocationRadius")) {
    mapBoxMap.removeSource("currentLocationRadius");
  }
}

export function setNearbyStops(
  mapBoxMap: any,
  stopLocations: StopLocationsDictionary,
  handleStopMarkerClick: (data: any) => void
) {
  console.log('setting nearby stops');

  const features = map(stopLocations, stopLocation => {
    return {
      geometry: {
        type: "Point",
        coordinates: [stopLocation.lng, stopLocation.lat]
      },
      properties: {
        locid: stopLocation.locid
      },
      type: "Feature"
    };
  });

  const nearbyStopLocationsSource = mapBoxMap.addSource("stopLocationsSource", {
    data: {
      type: "FeatureCollection",
      features
    },
    type: "geojson"
  });

  const stopLocationLayer = mapBoxMap.addLayer({
    id: "stopLocationLayer",
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 8,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2
    },
    source: "stopLocationsSource",
    type: "circle"
  });

  // Center the map on the coordinates of any clicked circle from the 'circle' layer.
  mapBoxMap.on("click", "stopLocationLayer", e => {
    mapBoxMap.flyTo({
      center: e.features[0].geometry.coordinates
    });
    handleStopMarkerClick(e.features[0]);
  });

  // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
  mapBoxMap.on("mouseenter", "stopLocationLayer", () => {
    mapBoxMap.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  mapBoxMap.on("mouseleave", "stopLocationLayer", () => {
    mapBoxMap.getCanvas().style.cursor = "";
  });

  return [nearbyStopLocationsSource, stopLocationLayer];
}
