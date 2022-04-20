import React from "react";
import { Badge } from "react-bootstrap";
import { ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import RouteIndicator from "../../../component/route/RouteIndicator";
import CollapsiblePane from "../../lineDetail/component/CollapsiblePane";

interface LocationInfoPaneProps {
  arrivalData: ArrivalData;
}

function LocationInfoPane({ arrivalData }: LocationInfoPaneProps) {
  return (
    <CollapsiblePane className={undefined} title={"Info"} open={true}>
      <ul>
        <li>
          <strong>ID:</strong>
          {/*<Badge>{location.id}</Badge>*/}
        </li>
        <li>
          <strong>Serving Routes</strong> {/*{routes.map(routeId => (*/}
          {/*  <RouteIndicator key={routeId} routeId={routeId} />*/}
          {/*))}*/}
        </li>
        {/*<li>*/}
        {/*  <strong>Direction:</strong> {arrivalData.location.dir}*/}
        {/*</li>*/}
        <li>
          <strong>Queried:</strong> {arrivalData.queryTime}
        </li>
        <li>
          {/*<strong>Lat / Lng:</strong> {location.lat} / {location.lng}*/}
        </li>
        <li>{/*<strong>Passenger Code:</strong> {location.passengerCode}*/}</li>
      </ul>
    </CollapsiblePane>
  );
}

export default LocationInfoPane;
