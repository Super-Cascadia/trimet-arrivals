import { filter, includes, isEmpty, map } from "lodash";
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import RouteListItem from "../../../component/route/RouteListItem";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";

interface Props {
  loadAllRoutes: () => {};
  routes: RouteDataDictionary;
}

function LinesViewSubRoutes() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact={true} path={path}>
        Show all routes
      </Route>
      <Route path={`${path}/max`}>Show max Routes</Route>
      <Route path={`${path}/streetcar`}>Show max Routes</Route>
      <Route path={`${path}/bus`}>Show max Routes</Route>
    </Switch>
  );
}

export default class LinesViewComponent extends React.Component<Props> {
  private static getRoutes(routes: RouteDataDictionary) {
    return map(routes, (route: TrimetRoute) => {
      return <RouteListItem route={route} />;
    });
  }

  public componentDidMount(): void {
    this.props.loadAllRoutes();
  }

  public render() {
    const { routes } = this.props;

    if (isEmpty(routes)) {
      return "Loading...";
    }

    const WES = 203;
    const AREIAL_TRAM = 208;
    const STREET_CAR_ONE = 193;
    const STREET_CAR_TWO = 194;
    const STREET_CAR_THREE = 195;

    const busLines = filter(routes, route => route.type === "B");
    const maxLines = filter(routes, route => {
      return (
        route.type === "R" &&
        !includes([WES, AREIAL_TRAM, STREET_CAR_ONE, 194, 195], route.id)
      );
    });
    const streetCarLines = filter(routes, route => {
      return (
        route.type === "R" &&
        includes([STREET_CAR_ONE, STREET_CAR_TWO, STREET_CAR_THREE], route.id)
      );
    });
    const aerialTram = filter(routes, route => {
      return route.type === "R" && includes([AREIAL_TRAM], route.id);
    });
    const wesCommuterRail = filter(routes, route => {
      return route.type === "R" && includes([WES], route.id);
    });

    return (
      <div id="lines-view">
        <h2>Max Lines</h2>
        {LinesViewComponent.getRoutes(maxLines)}
        <h2>Street Car Lines</h2>
        {LinesViewComponent.getRoutes(streetCarLines)}
        <h2>Aerial Tram</h2>
        {LinesViewComponent.getRoutes(aerialTram)}
        <h2>WES Commuter Rail</h2>
        {LinesViewComponent.getRoutes(wesCommuterRail)}
        <h2>Bus Lines</h2>
        {LinesViewComponent.getRoutes(busLines)}
        <LinesViewSubRoutes />
      </div>
    );
  }
}
