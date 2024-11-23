import { forEach, map, set, uniq } from "lodash";
import { Map } from "mapbox-gl";
import { StopLocationsDictionary } from "../../../../store/reducers/util/formatStopLocations";

interface Geometry {
  coordinates: number[];
  type: string;
}

interface Feature {
  geometry: Geometry;
  type: "Feature";
  properties: {};
}

export function removeRouteLayers(map: Map, routeLayers: any[]) {
  console.log("removing route layers");
  // console.log("removing route layers", routeLayers);
  forEach(uniq(routeLayers), layerId => {
    map.removeLayer(layerId);
    map.removeSource(layerId);
  });
}

export function removeStopLocationLayers(mapBoxMap: Map) {
  console.log("removing stop location layers");
  if (mapBoxMap.getLayer("stopLocationLayer")) {
    mapBoxMap.removeLayer("stopLocationLayer");
  }

  if (mapBoxMap.getSource("stopLocationsSource")) {
    mapBoxMap.removeSource("stopLocationsSource");
  }
}

export function removeCurrentLocationMarkers(mapBoxMap: Map) {
  console.log("removing current location markers");
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
  mapBoxMap: Map,
  stopLocations: StopLocationsDictionary,
  handleStopMarkerClick: (data: any) => void
) {
  console.log("setting nearby stops");

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
      // @ts-ignore
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
      // @ts-ignore
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
