import React from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./StopLocationIndicator.css";

interface Props {
  locationId: number;
}

export default function StopLocationIndicator({ locationId }: Props) {
  return (
    <Link to={`/stop/${locationId}`}>
      <Badge>{locationId}</Badge>
    </Link>
  );
}
