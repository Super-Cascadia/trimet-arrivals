import React from "react";
import { Badge } from "react-bootstrap";
import RouteIndicator from "../../../component/route/RouteIndicator";
import {
  TrimetArrivalData,
  TrimetLocation
} from "../../../store/reducers/data/arrivalsDataReducer";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";

interface LocationInfoPaneProps {
  location: TrimetLocation;
  arrivals: TrimetArrivalData;
  routes: number[];
}

function LocationInfoPane({
  location,
  arrivals,
  routes
}: LocationInfoPaneProps) {
  return (
    <CollapsiblePane className={undefined} title={"Info"} open={true}>
      <ul>
        <li>
          <strong>ID:</strong>
          <Badge>{location.id}</Badge>
        </li>
        <li>
          <strong>Serving Routes</strong>{" "}
          {routes.map(routeId => (
            <RouteIndicator key={routeId} routeId={routeId} />
          ))}
        </li>
        <li>
          <strong>Direction:</strong> {location.dir}
        </li>
        <li>
          <strong>Queried:</strong> {arrivals.queryTime}
        </li>
        <li>
          <strong>Lat / Lng:</strong> {location.lat} / {location.lng}
        </li>
        <li>
          <strong>Passenger Code:</strong> {location.passengerCode}
        </li>
      </ul>
    </CollapsiblePane>
  );
}

export default LocationInfoPane;
