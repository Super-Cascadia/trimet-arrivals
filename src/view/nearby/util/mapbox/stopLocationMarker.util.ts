import { forEach, map, set, uniq } from "lodash";
import { Map } from "mapbox-gl";
import { StopLocationsDictionary } from "../../../../store/reducers/util/formatStopLocations";
import { STOP_LOCATION_LAYER, STOP_LOCATIONS_SOURCE, CURRENT_LOCATION_CIRCLE_LAYER, CURRENT_LOCATION_CIRCLE, CURRENT_LOCATION_RADIUS_LAYER, CURRENT_LOCATION_RADIUS } from "./consts";

export function removeRouteLayers(map: Map, routeLayers: any[]) {
  console.log("removing route layers", routeLayers);
  forEach(uniq(routeLayers), layerId => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    } 
    if (map.getSource(layerId)) {
      map.removeSource(layerId);
    }
  });
}

export function removeStopLocationLayers(mapBoxMap: Map) {
  console.log("removing stop location layers");
  if (mapBoxMap.getLayer(STOP_LOCATION_LAYER)) {
    mapBoxMap.removeLayer(STOP_LOCATION_LAYER);
  }

  if (mapBoxMap.getSource(STOP_LOCATIONS_SOURCE)) {
    mapBoxMap.removeSource(STOP_LOCATIONS_SOURCE);
  }
}

export function removeCurrentLocationMarkers(mapBoxMap: Map) {
  console.log("removing current location markers");
  if (mapBoxMap.getLayer(CURRENT_LOCATION_CIRCLE_LAYER)) {
    mapBoxMap.removeLayer(CURRENT_LOCATION_CIRCLE_LAYER);
  }

  if (mapBoxMap.getSource(CURRENT_LOCATION_CIRCLE)) {
    mapBoxMap.removeSource(CURRENT_LOCATION_CIRCLE);
  }

  if (mapBoxMap.getLayer(CURRENT_LOCATION_RADIUS_LAYER)) {
    mapBoxMap.removeLayer(CURRENT_LOCATION_RADIUS_LAYER);
  }

  if (mapBoxMap.getSource(CURRENT_LOCATION_RADIUS)) {
    mapBoxMap.removeSource(CURRENT_LOCATION_RADIUS);
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

  const nearbyStopLocationsSource = mapBoxMap.addSource(STOP_LOCATIONS_SOURCE, {
    data: {
      type: "FeatureCollection",
      // @ts-ignore
      features
    },
    type: "geojson"
  });

  const stopLocationLayer = mapBoxMap.addLayer({
    id: STOP_LOCATION_LAYER,
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 8,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 2
    },
    source: STOP_LOCATIONS_SOURCE,
    type: "circle"
  });

  // Center the map on the coordinates of any clicked circle from the 'circle' layer.
  mapBoxMap.on("click", STOP_LOCATION_LAYER, e => {
    mapBoxMap.flyTo({
      // @ts-ignore
      center: e.features[0].geometry.coordinates
    });
    handleStopMarkerClick(e.features[0]);
  });

  // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
  mapBoxMap.on("mouseenter", STOP_LOCATION_LAYER, () => {
    mapBoxMap.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  mapBoxMap.on("mouseleave", STOP_LOCATION_LAYER, () => {
    mapBoxMap.getCanvas().style.cursor = "";
  });

  return [nearbyStopLocationsSource, stopLocationLayer];
}
