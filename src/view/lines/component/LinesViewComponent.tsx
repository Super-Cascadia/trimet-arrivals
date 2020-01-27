import _ from "lodash";
import React from "react";
import { RouteDataDictionary } from "../../../store/reducers/data/routeDataReducer";

interface Props {
  loadAllRoutes: () => {};
  routes: RouteDataDictionary;
}

export default class LinesViewComponent extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadAllRoutes();
  }

  public render() {
    const { routes } = this.props;

    if (_.isEmpty(routes)) {
      return "Loading...";
    }

    return <div id="lines-view" />;
  }
}
