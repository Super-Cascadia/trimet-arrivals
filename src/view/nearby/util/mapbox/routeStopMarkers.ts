import { Map } from "mapbox-gl";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";

export function drawRouteStopMarkers(
  map: Map,
  stopLocation: ArrivalLocation,
  destinationStopLocation?: ArrivalLocation
) {
  // Remove existing route-specific stop markers if they exist
  removeRouteStopMarkers(map);

  // Create stop markers for from and to locations
  const stopFeatures = [];

  // Add from stop (red)
  stopFeatures.push({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [stopLocation.lng, stopLocation.lat]
    },
    properties: {
      locid: stopLocation.id,
      color: "#4264fb",
      type: "from"
    }
  });

  // Add destination stop (green) if provided
  if (destinationStopLocation) {
    stopFeatures.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [destinationStopLocation.lng, destinationStopLocation.lat]
      },
      properties: {
        locid: destinationStopLocation.id,
        color: "#4264fb",
        type: "to"
      }
    });
  }

  // Add source and layer for route-specific stop markers (using unique IDs)
  map.addSource("routeStopMarkersSource", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: stopFeatures
    }
  });

  map.addLayer({
    id: "routeStopMarkersLayer",
    type: "circle",
    source: "routeStopMarkersSource",
    paint: {
      "circle-color": ["get", "color"],
      "circle-radius": 16
    }
  });

  // Add text labels for stop markers
  map.addLayer({
    id: "routeStopMarkersLayer-label",
    type: "symbol",
    source: "routeStopMarkersSource",
    layout: {
      "text-field": ["to-string", ["get", "locid"]],
      "text-size": 14,
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
      "text-anchor": "center",
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-optional": false
    },
    paint: {
      "text-color": "#ffffff"
    }
  });
}

export function removeRouteStopMarkers(map: Map) {
  if (map.getLayer("routeStopMarkersLayer-label")) {
    map.removeLayer("routeStopMarkersLayer-label");
  }
  if (map.getLayer("routeStopMarkersLayer")) {
    map.removeLayer("routeStopMarkersLayer");
  }
  if (map.getSource("routeStopMarkersSource")) {
    map.removeSource("routeStopMarkersSource");
  }
}
