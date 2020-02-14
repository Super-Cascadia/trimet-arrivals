import React from "react";
import { Alert } from "../../../api/trimet/interfaces/alertsData";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import RouteIndicator from "../../../component/route/RouteIndicator";
import { getRouteIndicatorClassName } from "../../../component/route/RouteListItem";
import "./NearbyRouteDetail.scss";
import RouteAlerts from "./RouteAlerts";
import RouteDirections from "./RouteDirections";

interface Props {
  id: number;
  loadRouteData: (id: number) => {};
  loadAlertData: (id: number) => {};
  route: TrimetRoute;
  alerts: Alert[];
}

export default class NearbyRouteDetail extends React.Component<Props> {
  public componentDidMount(): void {
    const { id, loadAlertData, loadRouteData } = this.props;

    loadRouteData(id);
    loadAlertData(id);
  }

  public render() {
    const { route, id, alerts } = this.props;

    if (!route) {
      return <div>Loading</div>;
    }

    // tslint:disable-next-line:no-empty
    const foo = () => {};

    return (
      <div>
        <div
          className="route-header nearby-route"
          style={{ backgroundColor: `#${route.routeColor}` }}
        >
          <RouteIndicator
            key={route.route}
            routeId={route.route}
            route={undefined}
            onClick={foo}
            verbose={true}
            className="header-router-indicator"
          />
        </div>
        <RouteAlerts id={id} alerts={alerts} />
        <RouteDirections route={route} />
      </div>
    );
  }
}
