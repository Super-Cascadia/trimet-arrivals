import { map } from "lodash";
import { AnySourceData } from "mapbox-gl";
import { StopLocation } from "../../../api/trimet/interfaces/types";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";

interface Geometry {
  coordinates: number[];
  type: string;
}

interface Feature {
  geometry: Geometry;
  type: "Feature";
  properties: {};
}

function getFeatures(stopLocations: StopLocationsDictionary): Feature[] {
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

interface GeoJSONSource {
  data: {
    features: Feature[];
    type: string;
  };
  type: string;
}

export function setNearbyStopMarkers(
  mapSource,
  stopLocations: StopLocationsDictionary
) {
  // Add a GeoJSON source with 3 points.
  const stopsGeoJSON: GeoJSONSource = {
    data: {
      features: getFeatures(stopLocations),
      type: "FeatureCollection"
    },
    type: "geojson"
  };
  mapSource.addSource("points", stopsGeoJSON as AnySourceData);
  // Add a circle layer
  mapSource.addLayer({
    id: "circle",
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 8,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2
    },
    source: "points",
    type: "circle"
  });

  // Center the map on the coordinates of any clicked circle from the 'circle' layer.
  mapSource.on("click", "circle", e => {
    mapSource.flyTo({
      center: e.features[0].geometry.coordinates
    });
  });

  // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
  mapSource.on("mouseenter", "circle", () => {
    mapSource.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  mapSource.on("mouseleave", "circle", () => {
    mapSource.getCanvas().style.cursor = "";
  });
}
