import React from "react";
import "./StopLocationIndicator.css";

interface Props {
  locationId: number;
}

export default function StopLocationIndicator({ locationId }: Props) {
  return <span className="stop-location-indicator">{locationId}</span>;
}
