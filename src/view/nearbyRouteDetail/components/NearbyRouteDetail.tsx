import React from "react";
import { Route } from "../../../api/trimet/interfaces/routes";
import RouteIndicator from "../../../component/route/RouteIndicator";
import { getRouteIndicatorClassName } from "../../nearbyRoutes/component/NearbyRoutes";
import "./NearbyRouteDetail.scss";
import RouteDirections from "./RouteDirections";

interface Props {
  id: number;
  loadRouteData: (id: number) => {};
  route: Route;
}

export default class NearbyRouteDetail extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadRouteData(this.props.id);
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
