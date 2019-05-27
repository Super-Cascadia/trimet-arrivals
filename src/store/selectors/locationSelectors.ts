import { createSelector } from "reselect";
import { RootState } from "../reducers";

const currentLocation = (state: RootState) =>
  state.currentLocationReducer.coordinates;

export const currentLocationSelector = createSelector(
  currentLocation,
  (coordinates: number[]) => coordinates
);
