import _ from "lodash";
import { createSelector } from "reselect";
import { RootState } from "../reducers";
import { RouteDataDictionary } from "../reducers/data/routeDataReducer";
import { NearbyRoutesDictionary } from "../reducers/view/nearbyRoutesViewReducer";

const getAllRoutes = (state: RootState) => state.routeDataReducer.routes;

const getAllNearbyRouteIds = (state: RootState) =>
  state.nearbyRoutesViewReducer.nearbyRoutes;

export const allNearbyRoutesSelector = createSelector(
  getAllRoutes,
  getAllNearbyRouteIds,
  (allRoutes: RouteDataDictionary, nearbyRoutes: NearbyRoutesDictionary) => {
    return _.map(nearbyRoutes, (nearbyRoute, key) => {
      return allRoutes[key];
    });
  }
);

export const allNearbyRouteIdsSelector = createSelector(
  getAllNearbyRouteIds,
  (nearbyRoutes: NearbyRoutesDictionary) => nearbyRoutes
);
