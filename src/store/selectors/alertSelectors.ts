import { createSelector } from "reselect";
import { Alert } from "../../api/trimet/interfaces/alertsData";
import { RootState } from "../reducers";

const alertsById = (state: RootState, id: number) =>
  state.alertDataReducer.routeAlerts[id];

export const alertSelector = createSelector(
  alertsById,
  (routeAlerts: Alert[]) => routeAlerts
);
