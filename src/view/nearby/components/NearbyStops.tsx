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
import { getNormalizedDistanceString } from "../util/turfUtils";
import NearbySubNav from "./NearbySubNav";
import "./NearbyViewComponent.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

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

function getLocationInfo(stopLocations: StopData, currentLocation: number[]) {
  return map(
    stopLocations.location,
    (stopLocation: StopLocation, key: number) => {
      const distanceDescription = getNormalizedDistanceString(currentLocation, [
        stopLocation.lng,
        stopLocation.lat
      ]);
      return (
        <Card key={key}>
          <Card.Header as="h6">
            <StopLocationIndicator
              locationId={stopLocation.locid}
              nearbyStops={true}
            />
            {stopLocation.desc}
          </Card.Header>
          <ListGroup variant="flush">
            {stopLocation.route.map(r => getRouteDirections(r))}
          </ListGroup>
          <Card.Footer className="text-muted">
            {distanceDescription}
          </Card.Footer>
        </Card>
      );
    }
  );
}

interface Props {
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  stopCount: number;
  routeCount: number;
  currentLocation: number[];
}

export default function NearbyStops({
  nearbyStops,
  radiusSize,
  handleRadiusSelectionChange,
  routeCount,
  stopCount,
  currentLocation
}: Props) {
  if (!nearbyStops) {
    return <Loading />;
  }

  return (
    <div className="stops-wrapper scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
      />
      <br />
      <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
      <br />
      {getLocationInfo(nearbyStops, currentLocation)}
    </div>
  );
}
