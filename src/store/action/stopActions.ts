import * as constants from '../constants';
import { StopData, Location, ArrivalData } from '../../api/trimet/types';
import { getNearbyStops, getArrivals } from '../../api/trimet';

export interface LoadAction {
    type: 'LOAD_STOPS';
}

export interface ArrivalAction {
    type: 'LOAD_ARRIVALS';
}

export type StopActions = LoadAction;

export type ArrivalActions = ArrivalAction;

function getCurrentPosition() {
    return new Promise((resolve: Function, reject: Function) => {
      navigator.geolocation.getCurrentPosition((location: Location) => {
        resolve(location);
      });
    });
}

export const loadArrivalData = (locationId: number) => {
    const minutes = 45;
    return function (dispatch: Function, getState: Function) {
        dispatch({
            type: constants.LOAD_ARRIVALS,
            payload: {
                locationId
            }
        });

        const stringNumberLocationId = locationId.toString(10);

        getArrivals(stringNumberLocationId, minutes)
            .then((arrivalData: ArrivalData) => {
                dispatch({
                    type: constants.LOAD_ARRIVALS_COMPLETE,
                    payload: {
                        arrivalData,
                        locationId
                    }
                });
            });
    };
};

export const loadStopData = (radiusInFeet: number) => {
    return function (dispatch: Function) {
        dispatch({
            type: constants.LOAD_STOPS
        });

        getCurrentPosition()
            .then((location: Location) => {
                getNearbyStops(location, radiusInFeet)
                    .then((stopData: StopData) => {
                        dispatch({
                            type: constants.LOAD_STOP_COMPLETE,
                            payload: {
                                stopData
                            }
                        });

                        return stopData;
                    });
            });
    };
};