import _ from "lodash";
import React from "react";
import { Route } from "../../../api/trimet/interfaces/routes";
import RouteListItem from "../../../component/route/RouteListItem";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";

interface Props {
  loadAllRoutes: () => {};
  routes: RouteDataDictionary;
}

export default class LinesViewComponent extends React.Component<Props> {
  // private static getRoutes(routes: RouteDataDictionary) {
  //   return _.map(routes, (route: Route) => {
  //     return <RouteListItem route={route}/>
  //   })
  // }

  public componentDidMount(): void {
    this.props.loadAllRoutes();
  }

  public render() {
    const { routes } = this.props;

    if (_.isEmpty(routes)) {
      return "Loading...";
    }

    return (
      <div id="lines-view">{/*{LinesViewComponent.getRoutes(routes)}*/}</div>
    );
  }
}
