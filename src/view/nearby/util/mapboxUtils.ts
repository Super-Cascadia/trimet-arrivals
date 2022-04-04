// @ts-ignore
// tslint:disable-next-line:no-implicit-dependencies
import mapboxgl from "!mapbox-gl";
import { each, isUndefined } from "lodash";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";
import { LatLngCoords } from "../components/NearbyMapV2";

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

function addMapboxLayer(
  map,
  routeIdentifier: string,
  promise,
  sourceId: string
) {
  map.addSource(sourceId, {
    data: {
      geometry: promise.geometry,
      properties: {},
      type: "Feature"
    },
    type: "geojson"
  });

  const layer = map.addLayer({
    id: sourceId,
    layout: {
      "line-cap": "round",
      "line-join": "round"
    },
    paint: {
      "line-color": "#0080ff",
      "line-width": 5
    },
    source: sourceId,
    type: "line"
  });

  // layer.on("mouseover", e => {
  //   console.log("hover route", e);
  // });

  // layer.on("click", e => {
  //   console.log("click route", e);
  // });

  return layer;
}

function addRouteLayers(mapBoxMap, returnedPromises: any[]): any[] {
  const sources = {};
  const sourceIds = [];
  const routeLayers = [];

  each(returnedPromises, promise => {
    if (!promise.code) {
      const { route_number, direction } = promise.properties;
      const routeIdentifier = `${route_number}_${direction}`;
      const sourceId = `route-${routeIdentifier}`;
      sourceIds.push(sourceId);

      if (isUndefined(sources[sourceId])) {
        sources[sourceId] = {};
        const routeLayer = addMapboxLayer(
          mapBoxMap,
          routeIdentifier,
          promise,
          sourceId
        );
        routeLayers.push(routeLayer);
      }
    }
  });

  return sourceIds;
}

export function setRoutes(mapBoxMap, nearbyRouteIds: NearbyRoutesDictionary) {
  const promises = [];

  each(nearbyRouteIds, (route, routeId) => {
    each(route.directions, directionId => {
      const promise = getRouteGeometry(routeId, directionId);
      promises.push(promise);
    });
  });

  return Promise.all(promises)
    .then((returnedPromises: any[]) => {
      return Promise.resolve(addRouteLayers(mapBoxMap, returnedPromises));
    })
    .catch(err => {
      // tslint:disable
      console.error(err);
      return Promise.resolve([]);
    });
}
