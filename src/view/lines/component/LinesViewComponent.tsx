import { filter, isEmpty, map } from "lodash";
import React from "react";
import { Route } from "../../../api/trimet/interfaces/routes";
import RouteListItem from "../../../component/route/RouteListItem";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";

interface Props {
  loadAllRoutes: () => {};
  routes: RouteDataDictionary;
}

export default class LinesViewComponent extends React.Component<Props> {
  private static getRoutes(routes: RouteDataDictionary) {
    return map(routes, (route: Route) => {
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
    const maxLines = filter(routes, route => route.type === "T");
    const streetCarLines = filter(routes, route => route.type === "S");

    return (
      <div id="lines-view">
        <h1>Max Lines</h1>
        {LinesViewComponent.getRoutes(maxLines)}
        <h1>Street Car Lines</h1>
        {LinesViewComponent.getRoutes(streetCarLines)}
        <h1>Bus Lines</h1>
        {LinesViewComponent.getRoutes(busLines)}
      </div>
    );
  }
}
