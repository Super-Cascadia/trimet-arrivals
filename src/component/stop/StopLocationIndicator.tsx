import React from "react";
import { Link } from "react-router-dom";
import "./StopLocationIndicator.css";

interface Props {
  locationId: number;
  nearbyStops?: boolean;
  selected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * A component that displays a stop location indicator as a clickable link.
 * 
 * @param props - The component props
 * @param props.locationId - The unique identifier for the stop location
 * @param props.nearbyStops - Optional flag to indicate if this links to nearby stops view
 * @param props.selected - Optional flag to indicate selection state. If provided, styles change.
 * @param props.onClick - Optional click handler. If provided, renders as a button instead of a link.
 * @returns A link component that navigates to either the stop details or nearby stops page
 */
export default function StopLocationIndicator({
  locationId,
  nearbyStops,
  selected,
  onClick
}: Props) {
  const route = nearbyStops
    ? `/nearby/stops/${locationId}`
    : `/stop/${locationId}`;

  let className = "stop-location-indicator";
  if (selected === true) {
    className += " selected";
  } else if (selected === false) {
    className += " unselected";
  }

  if (onClick) {
    return (
      <span 
        className={className} 
        onClick={onClick}
        role="button"
        style={{ marginRight: '10px' }}
      >
        {locationId}
      </span>
    );
  }

  return (
    <Link to={route} className="stop-location-indicator-link">
      <span className={className}>{locationId}</span>
    </Link>
  );
}
