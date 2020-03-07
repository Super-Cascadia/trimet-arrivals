import React from "react";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import RouteListItem from "../../../component/route/RouteListItem";
import CollapsiblePane from "./CollapsiblePane";
import "./LineDetailView.scss";
import LineDetailViewStops from "./LineDetailViewStops";

interface Props {
  route: TrimetRoute;
  id: number;
  loadRouteData: (id: number) => {};
}

export default class LinesViewComponent extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadRouteData(this.props.id);
  }

  public render() {
    const { route } = this.props;

    if (!route) {
      return "Loading TrimetRoute data...";
    }

    return (
      <div id="lines-detail-view">
        <RouteListItem route={route} />
        <CollapsiblePane
          className="route-detail-information-pane"
          title="Information"
          open={true}
        >
          <strong>Hours of Operation:</strong> 5:00 AM - 12:00 PM
          <br />
          <strong>Connections:</strong>
          <br />
          <strong>Areas served:</strong>
        </CollapsiblePane>
        <CollapsiblePane className="route-detail-map" title={"Map"} open={true}>
          <p>Map goes here</p>
        </CollapsiblePane>
        <CollapsiblePane
          className="route-detail-stops"
          title="Stops"
          open={true}
        >
          <LineDetailViewStops route={route} />
        </CollapsiblePane>
      </div>
    );
  }
}
