// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl, { Map } from "!mapbox-gl";
import { forEach, map, set, uniq } from "lodash";
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
  routeIds: string[],
  handleStopMarkerClick: (data: any) => void
) {
  const isLoaded = mapBoxMap.loaded();
  console.log('is map loaded', isLoaded);
  console.log("setting nearby stops", stopLocations, routeIds);

  const features = map(stopLocations, stopLocation => {
    return {
      geometry: {
        type: "Point",
        coordinates: [stopLocation.lng, stopLocation.lat]
      },
      properties: {
        locid: stopLocation.locid,
        routeids: routeIds.join(',') // Ensure routeids are included
      },
      type: "Feature"
    };
  });

  mapBoxMap.addSource(STOP_LOCATIONS_SOURCE, {
    data: {
      type: "FeatureCollection",
      // @ts-ignore
      features
    },
    type: "geojson"
  });

  mapBoxMap.addLayer({
    id: STOP_LOCATION_LAYER,
    paint: {
      "circle-color": [
        "case",
        ["==", ["get", "locid"], "SPECIFIC_STOP_ID"], // Replace SPECIFIC_STOP_ID with the actual ID
        "#ff0000", // Color for the specific stop marker
        "#4264fb" // Default color for other markers
      ],
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
    // @TODO: set zoom level
    mapBoxMap.current.setZoom(16);
    handleStopMarkerClick(e.features[0].properties);
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // Show popup on hover
  mapBoxMap.on("mouseenter", STOP_LOCATION_LAYER, e => {
    // Change the cursor style as a UI indicator.
    mapBoxMap.getCanvas().style.cursor = "pointer";

    // @ts-ignore
    const coordinates = e.features[0].geometry.coordinates.slice();
    const locid = e.features[0].properties.locid;
    const routeids = e.features[0].properties.routeids;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const popupHtml = `<strong>Stop ID</strong>: ${locid}<br><strong>Routes</strong>: ${routeids.split(',').join(', ')}`;
    // Populate the popup and set its coordinates
    // based on the feature found.
    popup
      .setLngLat(coordinates)
      .setHTML(popupHtml)
      .addTo(mapBoxMap);
  });

  mapBoxMap.on("mouseleave", STOP_LOCATION_LAYER, () => {
    mapBoxMap.getCanvas().style.cursor = "";
    popup.remove();
  });
}

// Function to update the color of a specific stop marker by its ID
export function updateStopMarkerColor(mapBoxMap: Map, stopId: string, color: string) {
  const isLoaded = mapBoxMap.loaded();
  console.log('is map loaded', isLoaded);

  function setMarkerColor() {
    console.log('setting marker color', stopId, color);
    mapBoxMap.setPaintProperty(STOP_LOCATION_LAYER, "circle-color", [
      "case",
      ["==", ["get", "locid"], parseInt(stopId, 10)],
      color,
      "#4264fb" // Default color for other markers
    ]);
  }

  if (!isLoaded) {
    mapBoxMap.on("load", () => {
      setMarkerColor();
    });
  } else {
    setMarkerColor();
  }
}
