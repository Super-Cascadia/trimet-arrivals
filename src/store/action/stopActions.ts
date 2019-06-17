import {
  LOAD_ARRIVALS_DATA_REQUEST,
  LOAD_STOP_DATA_REQUEST,
  UPDATE_VIEW_REQUEST
} from "../constants";

export type LoadStopData = (radiusInFeet: number) => void;
export type LoadArrivalData = (locationId: number) => void;

export const loadArrivalDataRequest = (locationId: number) => ({
  payload: { locationId },
  type: LOAD_ARRIVALS_DATA_REQUEST
});

export const loadStopDataRequest = (radiusInFeet: number) => ({
  payload: { radiusInFeet },
  type: LOAD_STOP_DATA_REQUEST
});

export const changeViewRequest = (view: string) => ({
  payload: { view },
  type: UPDATE_VIEW_REQUEST
});
