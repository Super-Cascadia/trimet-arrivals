import { getNearbyStops, Location, StopData } from '../../api/trimet';
import * as constants from '../constants';

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
                    });
            });
    };
};