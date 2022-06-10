import { Dictionary, flatten, groupBy, map, mapKeys, mapValues } from "lodash";
import {
  Direction,
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { StopLocationsDictionary } from "../../../store/reducers/util/formatStopLocations";
import { NearbyRoutesDictionary } from "../../../store/reducers/view/nearbyRoutesViewReducer";

export function processRoutes(stopData: StopData): Dictionary<TrimetRoute[]> {
  const routes = stopData.location.map((location: StopLocation) => {
    return location.route.map((route: TrimetRoute) => route);
  });
  const mappedKeys = mapKeys(
    flatten(routes),
    (item: TrimetRoute) => `${item.route}-${item.dir[0].dir}`
  );

  return groupBy(mappedKeys, (key: TrimetRoute) => key.route);
}

export function getNearbyRouteIds(
  nearbyRoutes: Dictionary<TrimetRoute[]>
): NearbyRoutesDictionary {
  return mapValues(nearbyRoutes, (routes: TrimetRoute[]) => {
    const directions = map(routes, (route: TrimetRoute) => {
      return map(route.dir, (dir: Direction) => {
        return dir.dir;
      });
    });

    return {
      directions: flatten(directions)
    };
  });
}

export function getStopLocations(
  nearbyStops: StopData
): StopLocationsDictionary {
  return mapKeys(nearbyStops.location, (location: StopLocation) => {
    return location.locid;
  });
}
