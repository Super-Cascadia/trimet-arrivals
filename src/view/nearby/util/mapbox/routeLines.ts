import { each, isUndefined } from "lodash";
import { Map } from "mapbox-gl";
import { NearbyRoutesDictionary } from "../../../../store/reducers/view/nearbyRoutesViewReducer";

function getRouteGeometry(routeId: string, directionId: number) {
  return import(
    `../../../../data/trimet/geoJSON/${routeId}/${routeId}_${directionId}.json`
  ).catch(e => {
    return e;
  });
}

function addMapboxLayer(
  map: Map,
  routeIdentifier: string,
  promise,
  sourceId: string
): Map {
  const isLoaded = map.loaded();
  console.log('is map loaded', isLoaded);
  console.log('adding mapbox layer', sourceId, routeIdentifier);

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
      "line-dasharray": [2, 4],
      "line-opacity": 0.8,
      "line-width": 2
    },
    source: sourceId,
    type: "line"
  });

  layer.on("mouseover", e => {
    console.log("hover route", e);
  });

  layer.on("click", e => {
    console.log("click route", e);
  });

  return layer;
}

function addRouteLayers(mapBoxMap: Map, returnedPromises: any[]): any[] {
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
        const mapboxMap = addMapboxLayer(
          mapBoxMap,
          routeIdentifier,
          promise,
          sourceId
        );
        routeLayers.push(mapboxMap);
      }
    }
  });

  return sourceIds;
}

export function setRoutes(
  mapBoxMap: Map,
  nearbyRouteIds: NearbyRoutesDictionary
) {
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
