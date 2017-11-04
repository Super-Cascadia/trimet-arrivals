import { LOAD_STOPS, LOAD_STOP_COMPLETE } from '../constants';
import { mapKeys } from 'lodash';
import { StopLocation, StopData } from '../../api/trimet/types';

interface Payload {
    stopData: StopData;
}

interface Action {
    payload: Payload;
    type: string;
}

export interface StopLocationState {
    [index: number]: StopLocation;
}

const initialState = {
    loading: false
};

function getStopLocations(stopData: StopData): StopLocationState {
    return mapKeys(stopData.location, (location: StopLocation) => {
        return location.locid;
    });
}

const stopsReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case LOAD_STOPS:
            return {
                ...state,
                loading: true
            };
        case LOAD_STOP_COMPLETE:
            const stopLocations = getStopLocations(action.payload.stopData);

            return {
                ...state,
                stopLocations,
                loading: false
            };
        default:
            return { 
                ...state 
            };
    }
};

export default stopsReducer;