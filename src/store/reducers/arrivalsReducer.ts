import { ArrivalData, Arrival } from '../../api/trimet/types';
import { LOAD_ARRIVALS_COMPLETE, LOAD_ARRIVALS } from '../constants/index';
import { groupBy } from 'lodash';

export interface ArrivalsReducerState {
    loading: Boolean;
    arrivals: LocationArrivals;
}

interface Payload {
    arrivalData: ArrivalData;
}

interface Action {
    payload: Payload;
    type: string;
}

export interface LocationArrivals {
    [index: string]: Arrival[];
}

function getArrivals (arrivalData: ArrivalData): LocationArrivals {
    const arrivals = groupBy(arrivalData.arrival, (arrival: Arrival) => {
        return arrival.locid;
    });

    return arrivals;
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