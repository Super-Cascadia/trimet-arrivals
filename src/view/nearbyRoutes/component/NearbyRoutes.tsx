import { Dictionary, map } from "lodash";
import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import "./NearbyRoutes.scss";

function getRouteDirections(route: TrimetRoute) {
  return (
    <ListGroup.Item key={`${route.route}-${route.dir[0].dir}`}>
      <RouteIndicator routeId={route.route} />
      {route.dir[0].desc}
    </ListGroup.Item>
  );
}

function getRoutes(routes: Dictionary<TrimetRoute[]>) {
  return map(routes, (route: TrimetRoute[], key) => {
    return (
      <>
        <Card key={key}>
          <Card.Header as="h5">{route[0].desc}</Card.Header>
          <ListGroup variant="flush">
            {route.map(r => getRouteDirections(r))}
          </ListGroup>
        </Card>
        <br />
      </>
    );
  });
}

interface Props {
  nearbyRoutes: Dictionary<TrimetRoute[]>;
}

export default function NearbyRoutes({ nearbyRoutes }: Props) {
  return (
    <div id="nearby-view-routes">
      <br />
      {getRoutes(nearbyRoutes)}
    </div>
  );
}
