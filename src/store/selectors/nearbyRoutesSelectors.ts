import { createSelector } from "reselect";
import { RootState } from "../reducers";
import { RouteDirectionDict } from "../reducers/util/getRoutesFromStopLocations";
import { NearbyRoutesDictionary } from "../reducers/view/nearbyRoutesViewReducer";

const allNearbyRoutes = (state: RootState) =>
  state.nearbyRoutesDataReducer.nearbyRoutes;

const allNearbyRoutIds = (state: RootState) =>
  state.nearbyRoutesViewReducer.nearbyRoutes;

export const allNearbyRoutesSelector = createSelector(
  allNearbyRoutes,
  (nearbyRoutes: RouteDirectionDict) => nearbyRoutes
);

export const allNearbyRouteIdsSelector = createSelector(
  allNearbyRoutIds,
  (nearbyRoutes: NearbyRoutesDictionary) => nearbyRoutes
);
