import { LOAD_ROUTE_ALERT_DATA_REQUEST } from "../constants";

export const loadRouteAlertDataRequest = (id: number) => ({
  payload: { id },
  type: LOAD_ROUTE_ALERT_DATA_REQUEST
});
