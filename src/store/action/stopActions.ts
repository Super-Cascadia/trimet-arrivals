import { getCurrentPosition } from "../../api/geolocation";
import { getArrivals } from "../../api/trimet/arrivals";
import { getNearbyStops } from "../../api/trimet/stops";
import { ArrivalData, Location, StopData } from "../../api/trimet/types";
import {
  LOAD_ARRIVALS,
  LOAD_ARRIVALS_COMPLETE,
  LOAD_ARRIVALS_DATA_REQUEST,
  LOAD_STOP_COMPLETE,
  LOAD_STOP_DATA_REQUEST,
  LOAD_STOPS
} from "../constants";

export type LoadStopData = (radiusInFeet: number) => void;
export type LoadArrivalData = (locationId: number) => void;

export const loadArrivalData = (locationId: number) => {
  const minutes = 45;

  return dispatch => {
    dispatch({
      payload: {
        locationId
      },
      type: LOAD_ARRIVALS
    });

    const stringNumberLocationId = locationId.toString(10);

    getArrivals(stringNumberLocationId, minutes).then(
      (arrivalData: ArrivalData) => {
        dispatch({
          payload: {
            arrivalData,
            locationId
          },
          type: LOAD_ARRIVALS_COMPLETE
        });
      }
    );
  };
};

export const loadStopData = (radiusInFeet: number) => {
  return dispatch => {
    dispatch({ type: LOAD_STOPS });

    getCurrentPosition().then((location: Location) => {
      getNearbyStops(location, radiusInFeet).then((stopData: StopData) => {
        dispatch({
          payload: { stopData },
          type: LOAD_STOP_COMPLETE
        });
        return stopData;
      });
    });
  };
};

export const loadArrivalDataRequest = (locationId: number) => ({
  payload: { locationId },
  type: LOAD_ARRIVALS_DATA_REQUEST
});

export const loadStopDataRequest = (radiusInFeet: number) => ({
  payload: { radiusInFeet },
  type: LOAD_STOP_DATA_REQUEST
});
