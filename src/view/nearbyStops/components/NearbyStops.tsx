import { map } from "lodash";
import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import {
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import RouteIndicator from "../../../component/route/RouteIndicator";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import Loading from "../../loading/Loading";
import "../../nearby/components/NearbyViewComponent.scss";

function getRouteDirections(route: TrimetRoute) {
  return (
    <ListGroup.Item
      key={`${route.route}-${route.dir[0].dir}`}
      action={true}
      variant="light"
    >
      <RouteIndicator routeId={route.route} /> {route.dir[0].desc}
    </ListGroup.Item>
  );
}

interface Props {
  nearbyStops: StopData;
}
function getLocationInfo(stopLocations: StopData) {
  return map(
    stopLocations.location,
    (stopLocation: StopLocation, key: number) => {
      return (
        <>
          <Card key={key}>
            <Card.Header as="h6">
              <StopLocationIndicator locationId={stopLocation.locid} />
              {stopLocation.desc}
            </Card.Header>
            <Card.Body>
              {stopLocation.lat}
              {","}
              {stopLocation.lng}
            </Card.Body>
            <ListGroup variant="flush">
              {stopLocation.route.map(r => getRouteDirections(r))}
            </ListGroup>
          </Card>
          <br />
        </>
      );
    }
  );
}

export default function NearbyStops({ nearbyStops }: Props) {
  if (!nearbyStops) {
    return <Loading />;
  }

  return (
    <div className="stops-wrapper">
      <br />
      {getLocationInfo(nearbyStops)}
    </div>
  );
}
