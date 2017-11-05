import * as constants from '../constants';
import { StopData, Location, StopLocation, ArrivalData } from '../../api/trimet/types';
import { getNearbyStops, getArrivals } from '../../api/trimet';
import { map } from 'lodash';

export interface LoadAction {
    type: 'LOAD_STOPS';
}

export type StopActions = LoadAction;

function getCurrentPosition() {
    return new Promise((resolve: Function, reject: Function) => {
      navigator.geolocation.getCurrentPosition((location: Location) => {
        resolve(location);
      });
    });
}

function getLocationIds(stopData: StopData): string {
    const locationIdList = map(stopData.location, (location: StopLocation) => {
        return location.locid;
    });

    return locationIdList.join(',');
}

export const loadStopData = (radiusInFeet: number) => {
    return function (dispatch: Function, getState: Function) {
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
                    })
                    .then((stopData: StopData) => {
                        const locIDs = getLocationIds(stopData);
                        const minutes = 45;

                        dispatch({
                            type: constants.LOAD_ARRIVALS
                        });

                        getArrivals(locIDs, minutes)
                            .then((arrivalData: ArrivalData) => {
                                dispatch({
                                    type: constants.LOAD_ARRIVALS_COMPLETE,
                                    payload: {
                                        arrivalData
                                    }
                                });
                            });
                    });
            });
    };
};