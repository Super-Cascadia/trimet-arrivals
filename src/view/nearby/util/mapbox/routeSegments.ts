import { Map } from "mapbox-gl";
import * as turf from "@turf/turf";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";

export function drawRouteSegment(
  map: Map,
  routeId: string,
  direction: string,
  fromLocation: ArrivalLocation,
  toLocation: ArrivalLocation
) {
  // Remove existing route segment layer if it exists
  removeRouteSegment(map);

  // Get the route geometry from the map source
  const routeSourceId = `route-${routeId}_${direction}`;
  const routeSource = map.getSource(routeSourceId);

  if (routeSource && (routeSource as any)._data) {
    const routeGeometry = (routeSource as any)._data.geometry;

    if (routeGeometry && routeGeometry.type === "LineString" && routeGeometry.coordinates) {
      // Find the closest points on the route to our stops
      const fromPoint = turf.point([fromLocation.lng, fromLocation.lat]);
      const toPoint = turf.point([toLocation.lng, toLocation.lat]);
      const routeLine = turf.lineString(routeGeometry.coordinates);

      // Get the closest points on the line to our stops
      const fromSnapped = turf.nearestPointOnLine(routeLine, fromPoint);
      const toSnapped = turf.nearestPointOnLine(routeLine, toPoint);

      // Get the indices of these points
      const fromIndex = fromSnapped.properties.index || 0;
      const toIndex = toSnapped.properties.index || 0;

      // Extract the segment between the two points
      const startIndex = Math.min(fromIndex, toIndex);
      const endIndex = Math.max(fromIndex, toIndex);
      const segmentCoords = routeGeometry.coordinates.slice(startIndex, endIndex + 1);

      // Create the segment geometry
      const segmentFeature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: segmentCoords
        },
        properties: {}
      };

      map.addSource("routeSegmentSource", {
        type: "geojson",
        data: segmentFeature as any
      });

      map.addLayer({
        id: "routeSegmentLayer",
        type: "line",
        source: "routeSegmentSource",
        layout: {
          "line-cap": "round",
          "line-join": "round"
        },
        paint: {
          "line-color": "#0080ff",
          "line-width": 6,
          "line-opacity": 1.0
        }
      });
    }
  }
}

export function removeRouteSegment(map: Map) {
  if (map.getLayer("routeSegmentLayer")) {
    map.removeLayer("routeSegmentLayer");
  }
  if (map.getSource("routeSegmentSource")) {
    map.removeSource("routeSegmentSource");
  }
}
