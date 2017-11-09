import { ArrivalData, Arrival } from '../../api/trimet/types';
import { LOAD_ARRIVALS_COMPLETE, LOAD_ARRIVALS } from '../constants';
import { groupBy } from 'lodash';

export interface Stoploading {
    loading: boolean;
}

export interface StopLoadingState {
    [index: number]: Stoploading;
}

export interface ArrivalsReducerState {
    loading: Boolean;
    arrivals: LocationArrivals;
    stopLoadingState: StopLoadingState;
}

interface Payload {
    arrivalData: ArrivalData;
    locationId: number;
}

interface Action {
    payload: Payload;
    type: string;
}

export interface LocationArrivals {
    [index: string]: Arrival[];
}

function getArrivals (arrivalData: ArrivalData): LocationArrivals {
    return groupBy(arrivalData.arrival, (arrival: Arrival) => {
        return arrival.locid;
    });
}

const initialState = {
    loading: false,
    arrivals: {},
    stopLoadingState: {}
};

function setLatestStopLoadingState(state: StopLoadingState, locationId: number, newState: boolean) {
    const stopLoadingState = { ...state };

    stopLoadingState[locationId] = {
        loading: newState
    };

    return stopLoadingState;
}

function updateArrivalsState(state: LocationArrivals, locationId: number, newArrivals: LocationArrivals) {
    return {
        ...state,
        ...newArrivals
    };
}

const arrivalsReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case LOAD_ARRIVALS:
            return {
                ...state,
                stopLoadingState: setLatestStopLoadingState(state.stopLoadingState, action.payload.locationId, true)
            };
        case LOAD_ARRIVALS_COMPLETE:
            const arrivals = getArrivals(action.payload.arrivalData);

            return {
                ...state,
                arrivals: updateArrivalsState(state.arrivals, action.payload.locationId, arrivals),
                stopLoadingState: setLatestStopLoadingState(state.stopLoadingState, action.payload.locationId, false)
            };
        default:
            return { 
                ...state 
            };
    }
};

export default arrivalsReducer;