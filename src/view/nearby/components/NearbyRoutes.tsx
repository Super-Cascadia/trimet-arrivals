import { Dictionary, map } from "lodash";
import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { TrimetRoute } from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import NearbySubNav from "./common/NearbySubNav";
import "./NearbyRoutes.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

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
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  routeCount: number;
  stopCount: number;
}

export default function NearbyRoutes({
  nearbyRoutes,
  radiusSize,
  handleRadiusSelectionChange,
  routeCount,
  stopCount
}: Props) {
  return (
    <div id="nearby-view-routes" className="scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
      />
      <br />
      <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
      <br />
      {getRoutes(nearbyRoutes)}
    </div>
  );
}
