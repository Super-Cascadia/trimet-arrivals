import _ from "lodash";
import React from "react";
import { Alert } from "../../../api/trimet/interfaces/alertsData";
import "./NearbyRouteDetail.scss";

interface Props {
  id: number;
  alerts: Alert[];
}

function getAlerts(alerts: Alert[]) {
  return _.map(alerts, alert => {
    return <li>{alert.desc}</li>;
  });
}

export default class RouteAlerts extends React.Component<Props> {
  public render() {
    const { alerts } = this.props;

    if (!alerts) {
      return <div>Loading</div>;
    }

    return (
      <div className="route-alerts-wrapper">
        <h3>Alerts</h3>
        <ul>{getAlerts(alerts)}</ul>
      </div>
    );
  }
}
