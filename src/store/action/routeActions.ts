import {
  LOAD_ALL_ROUTES_DATA_REQUEST,
  LOAD_ROUTE_DATA_REQUEST
} from "../constants";

export const loadRouteDataRequest = (id: number) => ({
  payload: { id },
  type: LOAD_ROUTE_DATA_REQUEST
});

export const loadAllRouteDataRequest = () => ({
  type: LOAD_ALL_ROUTES_DATA_REQUEST
});
