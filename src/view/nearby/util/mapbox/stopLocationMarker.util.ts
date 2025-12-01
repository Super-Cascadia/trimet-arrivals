// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl, { Map } from "!mapbox-gl";
import { map } from "lodash";
import { StopLocationsDictionary } from "../../../../store/reducers/util/formatStopLocations";
import {
  STOP_LOCATION_LAYER,
  STOP_LOCATIONS_SOURCE,
  CURRENT_LOCATION_CIRCLE_LAYER,
  CURRENT_LOCATION_CIRCLE,
  CURRENT_LOCATION_RADIUS_LAYER,
  CURRENT_LOCATION_RADIUS
} from "./consts";

export function removeStopLocationLayers(mapBoxMap: Map) {
  let map = mapBoxMap;
  console.log("removing stop location layers");
  
  // Remove label layer first (must remove layers before source)
  if (mapBoxMap.getLayer(STOP_LOCATION_LAYER + "-label")) {
    console.log("removing label layer");
    map = mapBoxMap.removeLayer(STOP_LOCATION_LAYER + "-label");
  }
  
  if (mapBoxMap.getLayer(STOP_LOCATION_LAYER)) {
    console.log("removing circle layer");
    map = mapBoxMap.removeLayer(STOP_LOCATION_LAYER);
  }

  if (mapBoxMap.getSource(STOP_LOCATIONS_SOURCE)) {
    console.log("removing source");
    map = mapBoxMap.removeSource(STOP_LOCATIONS_SOURCE);
  }

  return map;
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
  const isLoaded = mapBoxMap?.loaded();
  console.log("is map loaded", isLoaded);
  console.log("setting nearby stops", stopLocations, routeIds);

  const addMarkersToMap = () => {
    const features = map(stopLocations, stopLocation => {
    return {
      geometry: {
        type: "Point",
        coordinates: [stopLocation.lng, stopLocation.lat]
      },
      properties: {
        locid: stopLocation.locid,
        routeids: routeIds.join(",") // Ensure routeids are included
      },
      type: "Feature"
    };
  });

  if (!mapBoxMap.getSource(STOP_LOCATIONS_SOURCE)) {
    mapBoxMap.addSource(STOP_LOCATIONS_SOURCE, {
      data: {
        type: "FeatureCollection",
        // @ts-ignore
        features
      },
      type: "geojson"
    });
  }

  if (!mapBoxMap.getLayer(STOP_LOCATION_LAYER)) {
      mapBoxMap.addLayer({
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
  }

  // Center the map on the coordinates of any clicked circle from the 'circle' layer.
  mapBoxMap.on("click", STOP_LOCATION_LAYER, e => {
    mapBoxMap.flyTo({
      // @ts-ignore
      center: e.features[0].geometry.coordinates
    });
    // @TODO: set zoom level
    mapBoxMap.setZoom(16);
    const data = e.features[0];
    handleStopMarkerClick(data);
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

    const popupHtml = routeids 
      ? `<strong>Stop ID</strong>: ${locid}<br><strong>Routes</strong>: ${routeids.split(",").join(", ")}`
      : `<strong>Stop ID</strong>: ${locid}`;
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
  };

  // Use requestAnimationFrame to defer layer creation until after current render cycle
  // This ensures any layer removal operations are fully complete
  const isStyleLoaded = mapBoxMap.isStyleLoaded();
  console.log('[setStopMarkers] isStyleLoaded:', isStyleLoaded);
  
  if (!isStyleLoaded) {
    console.log('[setStopMarkers] Style not loaded, waiting for idle event');
    mapBoxMap.once("idle", () => {
      console.log('[setStopMarkers] idle event fired, deferring marker creation');
      // Defer to next frame to ensure removal is complete
      requestAnimationFrame(() => {
        console.log('[setStopMarkers] requestAnimationFrame callback, adding markers now');
        addMarkersToMap();
      });
    });
  } else {
    console.log('[setStopMarkers] Style loaded, deferring marker creation');
    // Defer to next frame to ensure any removal operations are complete
    requestAnimationFrame(() => {
      console.log('[setStopMarkers] requestAnimationFrame callback, adding markers now');
      addMarkersToMap();
    });
  }

  return mapBoxMap;
}

// Function to update the color of a specific stop marker by its ID
export function updateStopMarkerColor(
  mapBoxMap: Map,
  stopId: string,
  color: string
) {
  if (!mapBoxMap) {
    console.warn("mapBoxMap is null, cannot update marker color");
    return;
  }
  
  const isLoaded = mapBoxMap?.loaded();
  console.log("is map loaded", isLoaded);

  function setMarkerColor() {
    // Check if the layer exists before trying to update it
    if (!mapBoxMap.getLayer(STOP_LOCATION_LAYER)) {
      console.log("Stop location layer does not exist, skipping marker color update");
      return;
    }
    
    console.log("setting marker color", stopId, color);
    mapBoxMap.setPaintProperty(STOP_LOCATION_LAYER, "circle-color", [
      "case",
      ["==", ["get", "locid"], parseInt(stopId, 10)],
      "#4264fb", // Keep blue even when highlighted
      "#4264fb" // Default color for other markers
    ]);
    
    // Scale up the highlighted marker
    mapBoxMap.setPaintProperty(STOP_LOCATION_LAYER, "circle-radius", [
      "case",
      ["==", ["get", "locid"], parseInt(stopId, 10)],
      20, // Larger radius for highlighted marker
      16  // Default radius
    ]);
  }

  // if (!isLoaded) {
  //   mapBoxMap?.on("load", () => {
  //     setMarkerColor();
  //   });
  // } else {
  //   setMarkerColor();
  // }

  setMarkerColor();
}

export function setLabeledStops(
  mapBoxMap: Map,
  labeledStops: Array<{locid: number, label: string, lng: number, lat: number}>,
  handleStopMarkerClick: (data: any) => void
) {
  const isLoaded = mapBoxMap?.loaded();
  console.log('[setLabeledStops] Called - map loaded:', isLoaded);
  console.log('[setLabeledStops] labeledStops count:', labeledStops?.length);
  console.log('[setLabeledStops] labeledStops data:', labeledStops);
  console.log('[setLabeledStops] mapBoxMap exists:', !!mapBoxMap);

  const addMarkersToMap = () => {
    console.log('[setLabeledStops.addMarkersToMap] Starting to add markers');
    const features = labeledStops.map(stop => {
      return {
        geometry: {
          type: "Point",
          coordinates: [stop.lng, stop.lat]
        },
        properties: {
          locid: stop.locid,
          label: stop.label
        },
        type: "Feature"
      };
    });

    const sourceExists = mapBoxMap.getSource(STOP_LOCATIONS_SOURCE);
    console.log('[setLabeledStops.addMarkersToMap] Source exists:', !!sourceExists);
    
    if (!sourceExists) {
      console.log('[setLabeledStops.addMarkersToMap] Adding source with', features.length, 'features');
      mapBoxMap.addSource(STOP_LOCATIONS_SOURCE, {
        data: {
          type: "FeatureCollection",
          // @ts-ignore
          features
        },
        type: "geojson"
      });
      console.log('[setLabeledStops.addMarkersToMap] Source added');
    } else {
      console.log('[setLabeledStops.addMarkersToMap] Source already exists, updating data with', features.length, 'features');
      // Update existing source with new data
      (sourceExists as any).setData({
        type: "FeatureCollection",
        // @ts-ignore
        features
      });
      console.log('[setLabeledStops.addMarkersToMap] Source data updated');
    }

    // Always ensure circle layer exists
    const layerExists = mapBoxMap.getLayer(STOP_LOCATION_LAYER);
    console.log('[setLabeledStops.addMarkersToMap] Circle layer exists:', !!layerExists);
    
    if (!layerExists) {
      console.log('[setLabeledStops.addMarkersToMap] Adding circle layer');
      mapBoxMap.addLayer({
        id: STOP_LOCATION_LAYER,
        paint: {
          "circle-color": "#4264fb",
          "circle-radius": 16
        },
        source: STOP_LOCATIONS_SOURCE,
        type: "circle"
      });
      console.log('[setLabeledStops.addMarkersToMap] Circle layer added');
    } else {
      console.log('[setLabeledStops.addMarkersToMap] Circle layer already exists');
    }

    // Always ensure text label layer exists
    const labelLayerExists = mapBoxMap.getLayer(STOP_LOCATION_LAYER + "-label");
    console.log('[setLabeledStops.addMarkersToMap] Label layer exists:', !!labelLayerExists);
    
    if (!labelLayerExists) {
      console.log('[setLabeledStops.addMarkersToMap] Adding label layer');
      mapBoxMap.addLayer({
        id: STOP_LOCATION_LAYER + "-label",
        type: "symbol",
        source: STOP_LOCATIONS_SOURCE,
        layout: {
          "text-field": ["get", "label"],
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
      console.log('[setLabeledStops.addMarkersToMap] Label layer added');
    } else {
      console.log('[setLabeledStops.addMarkersToMap] Label layer already exists');
    }
    
    console.log('[setLabeledStops.addMarkersToMap] ✓ Markers setup complete - layers should be visible now');

  // Center the map on the coordinates of any clicked circle from the 'circle' layer.
  mapBoxMap.on("click", STOP_LOCATION_LAYER, e => {
    mapBoxMap.flyTo({
      // @ts-ignore
      center: e.features[0].geometry.coordinates
    });
    mapBoxMap.setZoom(16);
    const data = e.features[0];
    handleStopMarkerClick(data);
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // Show popup on hover
  mapBoxMap.on("mouseenter", STOP_LOCATION_LAYER, e => {
    mapBoxMap.getCanvas().style.cursor = "pointer";

    // @ts-ignore
    const coordinates = e.features[0].geometry.coordinates.slice();
    const locid = e.features[0].properties.locid;
    const label = e.features[0].properties.label;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const popupHtml = `<strong>Stop ${label}</strong><br>Stop ID: ${locid}`;
    popup
      .setLngLat(coordinates)
      .setHTML(popupHtml)
      .addTo(mapBoxMap);
    });

    mapBoxMap.on("mouseleave", STOP_LOCATION_LAYER, () => {
      mapBoxMap.getCanvas().style.cursor = "";
      popup.remove();
    });
  };

  // Use requestAnimationFrame to defer layer creation until after current render cycle
  // This ensures any layer removal operations are fully complete
  const isStyleLoaded = mapBoxMap.isStyleLoaded();
  console.log('[setLabeledStops] isStyleLoaded:', isStyleLoaded);
  
  if (!isStyleLoaded) {
    console.log('[setLabeledStops] Style not loaded, waiting for idle event');
    mapBoxMap.once("idle", () => {
      console.log('[setLabeledStops] idle event fired, deferring marker creation');
      // Defer to next frame to ensure removal is complete
      requestAnimationFrame(() => {
        console.log('[setLabeledStops] requestAnimationFrame callback, adding markers now');
        addMarkersToMap();
      });
    });
  } else {
    console.log('[setLabeledStops] Style loaded, deferring marker creation');
    // Defer to next frame to ensure any removal operations are complete
    requestAnimationFrame(() => {
      console.log('[setLabeledStops] requestAnimationFrame callback, adding markers now');
      addMarkersToMap();
    });
  }

  return mapBoxMap;
}
