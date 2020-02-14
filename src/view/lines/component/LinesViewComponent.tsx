import { filter, isEmpty, map } from "lodash";
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

    const busLines = filter(routes, route => route.type === "B");
    const maxLines = filter(routes, route => route.type === "R");
    const streetCarLines = filter(routes, route => route.type === "S");

    return (
      <div id="lines-view">
        <h1>Max Lines</h1>
        {LinesViewComponent.getRoutes(maxLines)}
        <h1>Street Car Lines</h1>
        {LinesViewComponent.getRoutes(streetCarLines)}
        <h1>Bus Lines</h1>
        {LinesViewComponent.getRoutes(busLines)}
        <LinesViewSubRoutes />
      </div>
    );
  }
}
