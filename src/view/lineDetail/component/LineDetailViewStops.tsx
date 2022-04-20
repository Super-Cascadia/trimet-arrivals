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

function getRouteDirectionStops(stops: RouteDirectionStop[]) {
  return map(stops, stop => {
    return (
      <tr>
        <td>
          <Link to={`/stop/${stop.locid}`}>{stop.locid}</Link>
        </td>
        <td>
          <small>{stop.desc}</small>
        </td>
        <td>{stop.dir}</td>
      </tr>
    );
  });
}

function getRouteDirections(routeDirections: RouteStopDirection[]) {
  return map(routeDirections, routeDirection => {
    return (
      <Col>
        <header>
          <h3 className="h6">{routeDirection.desc}</h3>
          <Table striped={true} bordered={true} hover={true} size="lg">
            <thead>
              <tr>
                <td>Stop ID</td>
                <td>Name</td>
                <td>Direction</td>
              </tr>
            </thead>
            <tbody>{getRouteDirectionStops(routeDirection.stop)}</tbody>
          </Table>
        </header>
      </Col>
    );
  });
}

export default function LineDetailViewStops(props: Props) {
  const { route } = props;

  if (!route.dir) {
    return <Loading />;
  }

  return <Row>{getRouteDirections(route.dir)}</Row>;
}
