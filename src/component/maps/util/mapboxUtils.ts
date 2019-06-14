import { concat, map, reduce } from "lodash";
import mapboxgl from "mapbox-gl";
import { Direction, Route, StopLocation } from "../../../api/trimet/types";
import { StopLocationsDictionary } from "../../../store/reducers/stopsReducer";
import { LatLngCoords } from "../NearbyStopsMap";

export function mountMapCenteredOnLocation(
  mapContainer,
  currentLocation: LatLngCoords
) {
  return new mapboxgl.Map({
    // @ts-ignore
    center: currentLocation,
    container: mapContainer,
    style: "mapbox://styles/mapbox/streets-v9",
    zoom: 15.25
  });
}

export function setCurrentLocationMarker(
  mapBoxMap,
  currentLocation: LatLngCoords
) {
  if (currentLocation) {
    mapBoxMap.addLayer({
      id: "currentlocation",
      layout: {
        "icon-image": "rocket-15"
      },
      source: {
        data: {
          features: [
            {
              geometry: {
                coordinates: currentLocation,
                type: "Point"
              },
              properties: {},
              type: "Feature"
            }
          ],
          type: "FeatureCollection"
        },
        type: "geojson"
      },
      type: "symbol"
    });
  }
}

export function setLocations(stopLocations: StopLocationsDictionary) {
  return map(stopLocations, (stopLocation: StopLocation) => {
    return {
      geometry: {
        coordinates: [stopLocation.lng, stopLocation.lat],
        type: "Point"
      },
      properties: {},
      type: "Feature"
    };
  });
}

export function setNearbyStopMarkers(
  mapBoxMap,
  stopLocations: StopLocationsDictionary
) {
  mapBoxMap.addLayer({
    id: "symbols",
    layout: {
      "icon-image": "bus-15"
    },
    source: {
      data: {
        features: setLocations(stopLocations),
        type: "FeatureCollection"
      },
      type: "geojson"
    },
    type: "symbol"
  });

  // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
  mapBoxMap.on("click", "symbols", e => {
    mapBoxMap.flyTo({ center: e.features[0].geometry.coordinates });
  });

  // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
  mapBoxMap.on("mouseenter", "symbols", () => {
    mapBoxMap.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  mapBoxMap.on("mouseleave", "symbols", () => {
    mapBoxMap.getCanvas().style.cursor = "";
  });
}

function getRouteGeometry() {
  return import("../../../data/6/6_0.json");
}

function getDirectionsOnRoute(route: Route, routeId: number) {
  return map(route.dir, (direction: Direction) => {
    const directionId = direction.dir;
    return { routeId, directionId };
  });
}

function getRoutes(stopLocation) {
  return reduce(
    stopLocation.route,
    (result: any, route: Route) => {
      const routeId = route.route;
      const directions = getDirectionsOnRoute(route, routeId);

      return concat(result, directions);
    },
    []
  );
}

function getRoutesFromStopLocations(stopLocations: StopLocationsDictionary) {
  return reduce(
    stopLocations,
    (routeResult: any, stopLocation) => {
      const routes = getRoutes(stopLocation);
      return concat(routeResult, routes);
    },
    []
  );
}

export function setRoutes(mapBoxMap, stopLocations: StopLocationsDictionary) {
  const routes = getRoutesFromStopLocations(stopLocations);
  const routeIdentifier = "6_0";

  getRouteGeometry().then(routeGeoJSON => {
    mapBoxMap.addLayer({
      id: routeIdentifier,
      source: {
        data: {
          geometry: routeGeoJSON.geometry,
          type: "Feature"
        },
        type: "geojson"
      },
      type: "line"
    });
  });
}
