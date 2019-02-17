import { LOAD_STOPS, LOAD_STOP_COMPLETE, LOAD_ARRIVALS_COMPLETE } from '../constants';
import { mapKeys } from 'lodash';
import { StopLocation, StopData } from '../../api/trimet/types';
import moment from 'moment';

export interface StopsReducerState {
    loading: boolean;
    stopLocations: StopLocationsDictionary;
    timeOfLastLoad: string;
}

interface Payload {
    stopData: StopData;
}

interface Action {
    payload?: Payload;
    type: string;
}

export interface StopLocationsDictionary {
    [index: number]: StopLocation;
}

function getStopLocations(stopLocation: StopLocation[]): StopLocationsDictionary {
    return mapKeys(stopLocation, (location: StopLocation) => {
        return location.locid;
    });
}

const initialState = {
    loading: false,
    timeOfLastLoad: ''
};

const stopsReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case LOAD_STOPS:
            return {
                ...state,
                loading: true
            };
        case LOAD_STOP_COMPLETE:
            const stopLocations = getStopLocations(action.payload.stopData.location);

            return {
                ...state,
                stopLocations,
                loading: false,
                timeOfLastLoad: moment().format('ddd, h:mm:ss a')
            };
        case LOAD_ARRIVALS_COMPLETE:
            return {
                ...state,
                timeOfLastLoad: moment().format('ddd, h:mm:ss a')
            };
        default:
            return { 
                ...state 
            };
    }
};

export default stopsReducer;