// @ts-ignore
import { map } from "lodash";
import mapboxgl from "mapbox-gl";
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

export function setNearbyStopMarkers(
  mapSource,
  stopLocations: StopLocationsDictionary
) {
  return map(stopLocations, (stopLocation: StopLocation) => {
    // create the popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      `Stop ID: ${stopLocation.locid}
       Description: ${stopLocation.desc}
      `
    );

    // create DOM element for the marker
    const el = document.createElement("div");
    el.id = "marker";

    return new mapboxgl.Marker({
      color: "#FFFFFF",
      draggable: false
    })
      .setLngLat([stopLocation.lng, stopLocation.lat])
      .setPopup(popup)
      .addTo(mapSource);
  });
}
