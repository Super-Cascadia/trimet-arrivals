import { map } from "lodash";
import React from "react";
import { Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  RouteDirectionStop,
  RouteStopDirection,
  TrimetRoute
} from "../../../api/trimet/interfaces/routes";
import Loading from "../../loading/Loading";
import "./LineDetailView.scss";

interface Props {
  route: TrimetRoute;
}

export default class LineDetailViewStops extends React.Component<Props> {
  private static getRouteDirectionStops(stops: RouteDirectionStop[]) {
    return map(stops, stop => {
      return (
        <tr>
          <td>
            <Link to={`/stop/${stop.locid}`}>{stop.locid}</Link>
          </td>
          <td>{stop.desc}</td>
          <td>{stop.dir}</td>
        </tr>
      );
    });
  }
  public render() {
    const { route } = this.props;

    if (!route.dir) {
      return <Loading />;
    }

    return <Row>{this.getRouteDirections(route.dir)}</Row>;
  }

  public getRouteDirections(routeDirections: RouteStopDirection[]) {
    return map(routeDirections, routeDirection => {
      return (
        <Col>
          <header>
            <h3>{routeDirection.desc}</h3>
            <Table striped={true} bordered={true} hover={true} size="lg">
              <thead>
                <tr>
                  <td>Stop ID</td>
                  <td>Name</td>
                  <td>Direction</td>
                </tr>
              </thead>
              <tbody>
                {LineDetailViewStops.getRouteDirectionStops(
                  routeDirection.stop
                )}
              </tbody>
            </Table>
          </header>
        </Col>
      );
    });
  }
}
