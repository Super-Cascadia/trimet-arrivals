import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import { LOAD_ARRIVALS_COMPLETE } from "../../constants";

export interface TrimetLocation {
  lat: number;
  lng: number;
  passengerCode: string;
  id: number;
  dir: string;
  desc: string;
}

export interface TrimetArrivalData {
  detour: TrimetRoute[];
  arrival: Arrival[];
  queryTime: string;
  location: TrimetLocation[];
}

interface Payload {
  arrivalData: TrimetArrivalData;
  locationId: number;
}

interface Action {
  payload?: Payload;
  type: string;
}

export interface LocationArrivals {
  [index: string]: TrimetArrivalData;
}

export interface ArrivalsDataReducerState {
  arrivals: LocationArrivals;
}

const initialState = {
  arrivals: {}
};

const arrivalsDataReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_ARRIVALS_COMPLETE:
      return {
        ...state,
        arrivals: {
          [action.payload.locationId]: action.payload.arrivalData
        }
      };
    default:
      return {
        ...state
      };
  }
};

export default arrivalsDataReducer;
