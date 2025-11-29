import React from "react";
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
    <Link to={route} className="stop-location-indicator-link">
      <span className="stop-location-indicator">{locationId}</span>
    </Link>
  );
}
