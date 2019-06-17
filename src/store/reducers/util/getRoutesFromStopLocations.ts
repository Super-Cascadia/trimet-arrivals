import { concat, map, reduce } from "lodash";
import { Direction, Route, StopLocation } from "../../../api/trimet/types";
import { RouteDirection, StopLocationsDictionary } from "../stopsReducer";

function getDirectionsOnRoute(route: Route, routeId: number): RouteDirection[] {
  return map(route.dir, (direction: Direction) => {
    const directionId = direction.dir;
    return { routeId, directionId };
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
  return reduce(
    stopLocations,
    (routeResult: RouteDirection[], stopLocation: StopLocation) => {
      const routes: RouteDirection[] = getRoutes(stopLocation);
      return concat(routeResult, routes);
    },
    []
  );
}
