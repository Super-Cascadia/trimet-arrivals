// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl, { Map } from "!mapbox-gl";

export function initializeMap(
  lng: number,
  lat: number,
  mapContainer: React.MutableRefObject<null>,
  zoom: number
): Map {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiamFtZXNvbm55ZWhvbHQiLCJhIjoiY2p3NWoyamV0MTk1dDQ0cGNmdGZkenViMiJ9.TqDD3r62vlPzVgPnYjocsg";

  return new mapboxgl.Map({
    center: [lng, lat],
    container: mapContainer.current,
    style: "mapbox://styles/mapbox/streets-v11",
    zoom
  });
}
