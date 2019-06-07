import { createSelector } from "reselect";
import { RootState } from "../reducers";

const currentLocation = (state: RootState) => {
  return state.currentLocationReducer.coordinates;
};

export const currentLocationSelector = createSelector(
  currentLocation,
  (coordinates: number[]) => coordinates
);
