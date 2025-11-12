import React from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./StopLocationIndicator.css";

interface Props {
  locationId: number;
  nearbyStops?: boolean;
}

export default function StopLocationIndicator({
  locationId,
  nearbyStops
}: Props) {
  const route = nearbyStops
    ? `/nearby/stops/${locationId}`
    : `/stop/${locationId}`;

  return (
    <Link to={route}>
      <Badge>{locationId}</Badge>
    </Link>
  );
}
