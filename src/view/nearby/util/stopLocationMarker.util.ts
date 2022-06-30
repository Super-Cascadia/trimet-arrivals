import { map } from "lodash";
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

export function setNearbyStops(
  mapBoxMap: any,
  stopLocations: StopLocationsDictionary,
  handleStopMarkerClick: (data: any) => void
) {
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

  mapBoxMap.addSource("nearbyStopLocations", {
    data: {
      type: "FeatureCollection",
      features
    },
    type: "geojson"
  });

  mapBoxMap.addLayer({
    id: "circle",
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 8,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2
    },
    source: "nearbyStopLocations",
    type: "circle"
  });

  // Center the map on the coordinates of any clicked circle from the 'circle' layer.
  mapBoxMap.on("click", "circle", e => {
    mapBoxMap.flyTo({
      center: e.features[0].geometry.coordinates
    });
    handleStopMarkerClick(e.features[0]);
  });

  // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
  mapBoxMap.on("mouseenter", "circle", () => {
    mapBoxMap.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  mapBoxMap.on("mouseleave", "circle", () => {
    mapBoxMap.getCanvas().style.cursor = "";
  });
}
