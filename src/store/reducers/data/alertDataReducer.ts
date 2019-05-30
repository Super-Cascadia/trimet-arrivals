import { Alert, AlertsData } from "../../../api/trimet/interfaces/alertsData";
import { LOAD_ROUTE_ALERTS_COMPLETE } from "../../constants";

export interface AlertDataReducerState {
  routeAlerts: {
    [id: string]: Alert[];
  };
}

const initialState = {
  routeAlerts: {}
};

interface Payload {
  alertData: AlertsData;
  id: number;
}

interface Action {
  payload?: Payload;
  type: string;
}

function updateRouteAlertsState(
  action: Action,
  state: AlertDataReducerState
): AlertDataReducerState {
  const { id, alertData } = action.payload;
  const alerts = alertData.alert;

  return {
    ...state,
    routeAlerts: {
      [id]: alerts
    }
  };
}

const alertDataReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case LOAD_ROUTE_ALERTS_COMPLETE:
      return updateRouteAlertsState(action, state);
    default:
      return {
        ...state
      };
  }
};

export default alertDataReducer;
