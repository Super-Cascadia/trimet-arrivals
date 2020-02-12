import React from "react";
import { Route } from "../../../api/trimet/interfaces/routes";
import RouteListItem from "../../../component/route/RouteListItem";
import "./LineDetailView.scss";

interface Props {
  route: Route;
}

export default class LinesViewComponent extends React.Component<Props> {
  public render() {
    const { route } = this.props;

    if (!route) {
      return "Loading Route data...";
    }

    return (
      <div id="lines-detail-view">
        <RouteListItem route={route} />
        <section>
          <h2>Route Information</h2>
          <article className="route-detail-pane route-detail-information-pane">
            <div>
              <p>
                <strong>Hours of Operation:</strong> 5:00 AM - 12:00 PM
                <br />
                <strong>Connections:</strong>
                <br />
                <strong>Areas served:</strong>
              </p>
            </div>
          </article>
        </section>
        <section>
          <h2>Route Map</h2>
          <article className="route-detail-pane route-detail-map" />
        </section>
        <section>
          <h2>Route Stops</h2>
          <article className="route-detail-pane route-detail-stops">
            <div>
              <p>Stop information goes here</p>
            </div>
          </article>
        </section>
      </div>
    );
  }
}
