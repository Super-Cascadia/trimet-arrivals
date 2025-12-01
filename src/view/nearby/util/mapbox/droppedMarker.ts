import { Map, Marker } from "mapbox-gl";
import * as mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";

/**
 * Creates and displays a draggable marker on the map with a radius circle.
 * Removes any existing dropped marker before adding the new one.
 * 
 * @param map - The Mapbox GL map instance
 * @param lng - Longitude coordinate for the marker
 * @param lat - Latitude coordinate for the marker
 * @param radiusSize - The radius size in feet for the circle around the marker
 * @param onDragEnd - Callback function invoked when the marker drag ends, receives the new lng/lat coordinates
 * @returns The created Marker instance
 */
export function setDroppedMarkerOnMap(
  map: Map,
  lng: number,
  lat: number,
  radiusSize: number,
  onDragEnd: (lng: number, lat: number) => void
): Marker {
  removeDroppedMarker(map);

  // Create a draggable marker using Mapbox GL JS Marker
  const el = document.createElement('div');
  el.className = 'dropped-marker-pin';
  el.style.width = '30px';
  el.style.height = '30px';
  el.style.borderRadius = '50% 50% 50% 0';
  el.style.background = '#FF6B6B';
  el.style.position = 'absolute';
  el.style.transform = 'rotate(-45deg)';
  el.style.border = '3px solid #ffffff';
  el.style.cursor = 'move';
  el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

  const marker = new mapboxgl.Marker({
    element: el,
    draggable: true
  })
    .setLngLat([lng, lat])
    .addTo(map);

  // Handle drag events
  marker.on('dragend', () => {
    const lngLat = marker.getLngLat();
    onDragEnd(lngLat.lng, lngLat.lat);
  });

  // Add radius circle around dropped marker
  const radiusCircle = turf.circle([lng, lat], radiusSize, {
    steps: 26,
    units: "feet"
  });

  map.addSource("droppedMarkerRadius", {
    type: "geojson",
    data: radiusCircle
  });

  // Add fill layer for the radius
  map.addLayer({
    id: "droppedMarkerRadiusLayer",
    type: "fill",
    source: "droppedMarkerRadius",
    paint: {
      "fill-color": "#FF6B6B",
      "fill-opacity": 0.08
    }
  });

  // Add outline stroke for the radius
  map.addLayer({
    id: "droppedMarkerRadiusOutlineLayer",
    type: "line",
    source: "droppedMarkerRadius",
    paint: {
      "line-color": "#FF6B6B",
      "line-width": 2,
      "line-opacity": 0.6
    }
  });

  return marker;
}

export function removeDroppedMarker(map: Map, marker?: Marker | null) {
  if (!map) return;

  // Remove the draggable marker
  if (marker) {
    marker.remove();
  }

  if (map.getLayer("droppedMarkerRadiusOutlineLayer")) {
    map.removeLayer("droppedMarkerRadiusOutlineLayer");
  }
  if (map.getLayer("droppedMarkerRadiusLayer")) {
    map.removeLayer("droppedMarkerRadiusLayer");
  }
  if (map.getSource("droppedMarkerRadius")) {
    map.removeSource("droppedMarkerRadius");
  }
}
