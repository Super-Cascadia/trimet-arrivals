import { concat, map, reduce, sortBy } from "lodash";
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
