import React from "react";
import { Alert } from "../../../api/trimet/interfaces/alertsData";
import { Route } from "../../../api/trimet/interfaces/routes";
import RouteIndicator from "../../../component/route/RouteIndicator";
import { getRouteIndicatorClassName } from "../../nearbyRoutes/component/NearbyRoutes";
import "./NearbyRouteDetail.scss";
import RouteDirections from "./RouteDirections";

interface Props {
  id: number;
  loadRouteData: (id: number) => {};
  loadAlertData: (id: number) => {};
  route: Route;
  alerts: Alert[];
}

export default class NearbyRouteDetail extends React.Component<Props> {
  public componentDidMount(): void {
    const { id } = this.props;
    this.props.loadRouteData(id);
    this.props.loadAlertData(id);
  }

  public render() {
    const { route } = this.props;

    if (!route) {
      return <div>Loading</div>;
    }

    // tslint:disable-next-line:no-empty
    const foo = () => {};
    const classNames = getRouteIndicatorClassName(route.id, "route-header");

    return (
      <div>
        <div className={classNames}>
          <RouteIndicator
            key={route.route}
            routeId={route.route}
            route={undefined}
            onClick={foo}
            verbose={true}
            className="header-router-indicator"
          />
        </div>
        <RouteDirections route={route} />
      </div>
    );
  }
}
