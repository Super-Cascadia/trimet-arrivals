import { each, reduce } from "lodash";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import { StopLocationsDictionary } from "./formatStopLocations";

export interface RouteDirectionsDict {
  [id: number]: {
    description: string;
  };
}

export interface RouteInfo {
  description: string;
  id: number;
  type: string;
}

export interface RouteAndRouteDirections {
  routeDirections: RouteDirectionsDict;
  routeInfo: RouteInfo;
}

export interface RouteDirectionDict {
  [routeId: number]: RouteAndRouteDirections;
}

function createInitialRoute(route: TrimetRoute): RouteAndRouteDirections {
  const routeDirection = route.dir[0];

  return {
    routeDirections: {
      [routeDirection.dir]: {
        description: routeDirection.desc
      }
    },
    routeInfo: {
      description: route.desc,
      id: route.route,
      type: route.type
    }
  };
}

function addDirectionToRoute(
  route,
  nearbyRoute,
  acc: RouteDirectionDict,
  routeId
) {
  const directionId = route.dir[0].dir;
  const routeDirection = nearbyRoute.routeDirections[directionId];

  if (!routeDirection) {
    acc[routeId].routeDirections[directionId] = {
      description: route.dir[0].desc
    };
  }
}

export function getRoutesFromStops(
  stopLocations: StopLocationsDictionary
): RouteDirectionDict {
  return reduce(
    stopLocations,
    (acc: RouteDirectionDict, stopLocation, key) => {
      each(stopLocation.route, route => {
        const routeId = route.route;
        const nearbyRoute = acc[routeId];

        if (!nearbyRoute) {
          acc[routeId] = createInitialRoute(route);
        } else {
          addDirectionToRoute(route, nearbyRoute, acc, routeId);
        }
      });

      return acc;
    },
    {}
  );
}
