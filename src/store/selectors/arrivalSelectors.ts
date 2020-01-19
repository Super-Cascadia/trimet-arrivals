import { createSelector } from "reselect";
import { Arrival } from "../../api/trimet/interfaces/types";
import { RootState } from "../reducers";

const arrivalsAtStopLoadingState = (state: RootState, locationId: number) =>
  state.arrivalsReducer.loading[locationId];

const arrivalsAtStop = (state: RootState, locationId: number) =>
  state.arrivalsReducer.arrivals[locationId];

export const arrivalsLoadingSelector = createSelector(
  arrivalsAtStopLoadingState,
  (loading: boolean) => loading
);

export const arrivalsAtStopSelector = createSelector(
  arrivalsAtStop,
  (arrivals: Arrival[]) => arrivals
);
