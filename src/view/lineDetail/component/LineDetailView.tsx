import React from "react";
import { TrimetRoute } from "../../../api/trimet/interfaces/routes";
import FrequentServiceIndicator from "../../../component/route/FrequentServiceIndicator";
import RouteListItem from "../../../component/route/RouteListItem";
import {
  LineScheduleInfo,
  maxLightRail
} from "../../../data/trimet/schedules/maxLightRail";
import CollapsiblePane from "./CollapsiblePane";
import "./LineDetailView.scss";
import LineDetailViewStops from "./LineDetailViewStops";

interface Props {
  route: TrimetRoute;
  id: number;
  loadRouteData: (id: number) => {};
}

function getScheduleContent(schedule: LineScheduleInfo) {
  return (
    <>
      <FrequentServiceIndicator frequentService={schedule.frequentService} />
      <strong>Hours of Operation:</strong> 5:00 AM - 12:00 PM
      <br />
      <strong>Connections:</strong>
      <br />
      <strong>Areas served:</strong>
    </>
  );
}

export default class LinesViewComponent extends React.Component<Props> {
  public componentDidMount(): void {
    this.props.loadRouteData(this.props.id);
  }

  public render() {
    const { route, id } = this.props;

    if (!route) {
      return "Loading TrimetRoute data...";
    }

    const routeSchedule = maxLightRail[id];

    return (
      <div id="lines-detail-view">
        <RouteListItem route={route} />
        <CollapsiblePane
          className="route-detail-information-pane"
          title="Schedule"
          open={true}
        >
          {getScheduleContent(routeSchedule)}
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
