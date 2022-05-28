// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl from "!mapbox-gl";
import { each } from "lodash";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import { LatLngCoords } from "../components/NearbyMap";

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

function getRouteGeometry(routeId: string, directionId: number) {
  return import(
    `../../../data/trimet/geoJSON/${routeId}/${routeId}_${directionId}.json`
  ).catch(e => {
    return e;
  });
}

function addMapboxLayer(mapBoxMap, routeIdentifier: string, promise) {
  mapBoxMap.addLayer({
    id: routeIdentifier,
    source: {
      data: {
        geometry: promise.geometry,
        type: "Feature"
      },
      type: "geojson"
    },
    type: "line"
  });
}

function addRouteLayers(mapBoxMap, returnedPromises: any[]) {
  each(returnedPromises, promise => {
    if (!promise.code) {
      const { route_number, direction } = promise.properties;
      const routeIdentifier = `${route_number}_${direction}`;

      addMapboxLayer(mapBoxMap, routeIdentifier, promise);
    }
  });
}

export function setRoutes(mapBoxMap, nearbyRouteIds: NearbyRoutesDictionary) {
  const promises = [];

  each(nearbyRouteIds, (route, routeId) => {
    each(route.directions, directionId => {
      const promise = getRouteGeometry(routeId, directionId);
      promises.push(promise);
    });
  });

  Promise.all(promises)
    .then((returnedPromises: any[]) => {
      addRouteLayers(mapBoxMap, returnedPromises);
    })
    .catch(err => {
      // tslint:disable
      console.error(err);
    });
}
