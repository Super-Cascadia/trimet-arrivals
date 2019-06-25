import { createSelector } from "reselect";
import { StopLocation } from "../../api/trimet/types";
import { RootState } from "../reducers";
import {
  RouteDirection,
  RouteDirectionDict
} from "../reducers/util/getRoutesFromStopLocations";

const allStopLocations = (state: RootState) => state.stopsReducer.stopLocations;
const allNearbyRoutes = (state: RootState) => state.stopsReducer.nearbyRoutes;

const stopLocationByLocationId = (state: RootState, locationId: number) =>
  state.stopsReducer.stopLocations[locationId];

const stopsLoading = (state: RootState) => state.stopsReducer.loading;

const stopTimeOfLastLoadReducer = (state: RootState) =>
  state.stopsReducer.timeOfLastLoad;

export const stopsLoadingSelector = createSelector(
  stopsLoading,
  (loading: boolean) => loading
);

export const allStopLocationsSelector = createSelector(
  allStopLocations,
  (stopLocations: StopLocation[]) => stopLocations
);

export const allNearbyRoutesSelector = createSelector(
  allNearbyRoutes,
  (nearbyRoutes: RouteDirectionDict) => nearbyRoutes
);

export const timeOfLastLoadSelector = createSelector(
  stopTimeOfLastLoadReducer,
  (timeOfLastLoad: string) => timeOfLastLoad
);

export const stopLocationSelector = createSelector(
  stopLocationByLocationId,
  (stopLocation: StopLocation) => stopLocation
);
