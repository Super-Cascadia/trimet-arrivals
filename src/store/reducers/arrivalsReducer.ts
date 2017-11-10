import { ArrivalData, Arrival } from '../../api/trimet/types';
import { LOAD_ARRIVALS_COMPLETE, LOAD_ARRIVALS } from '../constants';
import { groupBy } from 'lodash';

export interface StopLoadingState {
    [locationId: number]: boolean;
}

export interface ArrivalsReducerState {
    loading: boolean;
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
    arrivals: {},
    loading: {}
};

function setLatestStopLoadingState(state: StopLoadingState, locationId: number, newState: boolean): StopLoadingState {
    return {
        ...state,
        [locationId]: newState
    };
}

function updateArrivalsState(state: LocationArrivals, locationId: number, newArrivals: LocationArrivals): LocationArrivals {
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
                loading: setLatestStopLoadingState(state.loading, action.payload.locationId, true)
            };
        case LOAD_ARRIVALS_COMPLETE:
            const arrivals = getArrivals(action.payload.arrivalData);

            return {
                ...state,
                arrivals: updateArrivalsState(state.arrivals, action.payload.locationId, arrivals),
                loading: setLatestStopLoadingState(state.loading, action.payload.locationId, false)
            };
        default:
            return { 
                ...state 
            };
    }
};

export default arrivalsReducer;