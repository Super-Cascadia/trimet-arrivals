import { ArrivalData, Arrival } from '../../api/trimet/types';
import { LOAD_ARRIVALS_COMPLETE, LOAD_ARRIVALS } from '../constants/index';
import { mapKeys } from 'lodash';

export interface ArrivalsReducerState {
    loading: Boolean;
    arrivals: ArrivalState;
}

interface Payload {
    arrivalData: ArrivalData;
}

interface Action {
    payload: Payload;
    type: string;
}

export interface LocationArrivals {
    [index: string]: Arrival;
}

export interface ArrivalState {
    [index: number]: LocationArrivals;
}

function getArrivals (arrivalData: ArrivalData): ArrivalState {
    const arrivals = mapKeys(arrivalData.arrival, (arrival: Arrival) => {
        return arrival.tripID;
    });

    const locationId = arrivalData.location[0].id;

    return {
        [locationId]: arrivals
    };
}

const initialState = {
    loading: false,
    arrivals: {}
};

const arrivalsReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case LOAD_ARRIVALS:
            return {
                ...state,
                loading: true
            };
        case LOAD_ARRIVALS_COMPLETE:
            const arrivals = getArrivals(action.payload.arrivalData);

            return {
                ...state,
                arrivals,
                loading: false
            };
        default:
            return { 
                ...state 
            };
    }
};

export default arrivalsReducer;