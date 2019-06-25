import { concat, each, map, reduce, sortBy } from "lodash";
import { Direction, Route, StopLocation } from "../../../api/trimet/types";
import { StopLocationsDictionary } from "../stopsReducer";

export interface RouteDirection {
  routeId: number;
  directionId: number;
  routeDescription: string;
  routeDirectionDescription: string;
}

function getDirectionsOnRoute(route: Route, routeId: number): RouteDirection[] {
  return map(route.dir, (direction: Direction) => {
    const routeDescription = route.desc;
    const directionId = direction.dir;
    const routeDirectionDescription = direction.desc;

    return {
      directionId,
      routeDescription,
      routeDirectionDescription,
      routeId
    };
  });
}

function getRoutes(stopLocation: StopLocation): RouteDirection[] {
  return reduce(
    stopLocation.route,
    (result: RouteDirection[], route: Route) => {
      const routeId = route.route;
      const directions = getDirectionsOnRoute(route, routeId);

      return concat(result, directions);
    },
    []
  );
}

export default function getRoutesFromStopLocations(
  stopLocations: StopLocationsDictionary
): RouteDirection[] {
  const results = reduce(
    stopLocations,
    (routeResult: RouteDirection[], stopLocation: StopLocation) => {
      const routes: RouteDirection[] = getRoutes(stopLocation);
      return concat(routeResult, routes);
    },
    []
  );

  return sortBy(results, routeDirection => routeDirection.routeId);
}

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

function createInitialRoute(route: Route): RouteAndRouteDirections {
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

export function getRoutesFromStops2(
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
