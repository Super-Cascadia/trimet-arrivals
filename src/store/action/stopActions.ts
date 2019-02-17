import { StopData, Location, ArrivalData } from '../../api/trimet/types';
import { getArrivals } from '../../api/trimet/arrivals';
import { getNearbyStops } from '../../api/trimet/stops';
import { LOAD_ARRIVALS, LOAD_ARRIVALS_COMPLETE, LOAD_STOPS, LOAD_STOP_COMPLETE } from '../constants';
import { getCurrentPosition } from '../../api/geolocation';

export interface LoadAction {
    type: 'LOAD_STOPS';
}

export type StopActions = LoadAction;
export type LoadStopData = (radiusInFeet: number) => void;
export type LoadArrivalData = (locationId: number) => void;

export const loadArrivalData = (locationId: number) => {
    const minutes = 45;

    return function (dispatch: Function) {
        dispatch({
            type: LOAD_ARRIVALS,
            payload: {
                locationId
            }
        });

        const stringNumberLocationId = locationId.toString(10);

        getArrivals(stringNumberLocationId, minutes)
            .then((arrivalData: ArrivalData) => {
                dispatch({
                    type: LOAD_ARRIVALS_COMPLETE,
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
            type: LOAD_STOPS
        });

        getCurrentPosition()
            // @ts-ignore
            .then((location: Location) => {
                getNearbyStops(location, radiusInFeet)
                    .then((stopData: StopData) => {
                        dispatch({
                            type: LOAD_STOP_COMPLETE,
                            payload: {
                                stopData
                            }
                        });
                        return stopData;
                    });
            });
    };
};