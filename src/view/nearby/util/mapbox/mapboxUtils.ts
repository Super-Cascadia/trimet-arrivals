// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl from "!mapbox-gl";
import { LatLngCoords } from "../../components/NearbyMapV2";

export function mountMapCenteredOnLocation(
  mapContainer: HTMLDivElement,
  currentLocation: LatLngCoords
) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

  return new mapboxgl.Map({
    center: currentLocation, // starting position [lng, lat]
    container: mapContainer, // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    zoom: 16 // starting zoom
  });
}
