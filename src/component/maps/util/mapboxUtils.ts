import { map } from "lodash";
import mapboxgl from "mapbox-gl";
import { StopLocation } from "../../../api/trimet/types";
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
