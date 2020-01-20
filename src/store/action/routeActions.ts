import { LOAD_ROUTE_DATA_REQUEST } from "../constants";

export const loadRouteDataRequest = (id: number) => ({
  payload: { id },
  type: LOAD_ROUTE_DATA_REQUEST
});
