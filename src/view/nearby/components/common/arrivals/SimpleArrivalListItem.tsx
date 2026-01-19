import React from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Arrival } from "../../../../../api/trimet/interfaces/arrivals";
import {
  Direction,
  StopLocation,
  TrimetRoute
} from "../../../../../api/trimet/interfaces/types";
import { ArrivalCountdown } from "./ArrivalCountdown";
import { ArrivalTimestamp } from "./ArrivalTimestamp";
import { DistanceDisplay } from "./DistanceDisplay";
import { StatusIndicator } from "./StatusIndicator";
import "./SimpleArrivalListItem.scss";

/**
 * Props for the SimpleArrivalListItem component
 */
interface ArrivalListItemParams {
  /** Unique identifier for the list item */
  id: any;
  /** List of upcoming arrivals */
  arrivals?: Arrival[];
  /** TriMet route information */
  route: TrimetRoute;
  /** Stop location details */
  stop: StopLocation;
  /** Formatted distance string (e.g., "0.5 mi") */
  distanceString?: string;
  /** Current user location as [latitude, longitude] */
  currentLocation?: number[];
  /** Whether there are multiple stops for this route */
  hasMultipleStops?: boolean;
  /** Zero-based index of the current stop */
  currentStopIndex?: number;
  /** Total number of stops for this route */
  totalStops?: number;
  /** Callback to cycle between stops */
  onCycleStop?: (direction: 'prev' | 'next') => void;
  /** Callback when hovering over the item, receives stop ID or null */
  onHover?: (stopId: string | null) => void;
}

/**
 * A compact list item displaying arrival information for a TriMet route at a specific stop.
 * Shows the route number, direction, stop name, distance, and upcoming arrival times.
 * Supports cycling through multiple stops and hover interactions.
 * 
 * @param props - The component props
 * @returns A clickable list item with arrival information, or null if route/stop are missing
 */
function SimpleArrivalListItem({
  id,
  arrivals = [],
  route,
  stop,
  distanceString,
  currentLocation,
  hasMultipleStops,
  currentStopIndex,
  totalStops,
  onCycleStop,
  onHover
}: ArrivalListItemParams) {
  const navigate = useNavigate();

  if (!route || !stop) {
    return null;
  }

  const arrival = arrivals[0];
  const estimatedArrivalTime = arrival?.estimated;
  const scheduledArrivalTime = arrival?.scheduled;
  const routeDirection: Direction = route.dir[0];
  const routeId = route.route;
  const stopName = stop.desc;
  
  function handleClick() {
    const url = `/nearby/simple-routes/${routeId}?stop=${stop.locid}&direction=${routeDirection.dir}`;
    navigate(url);
  }

  const handleMouseEnter = () => {
    if (onHover) {
      onHover(stop.locid.toString());
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };

  const subsequentArrivals = arrivals.slice(1, 4);

  return (
    <ListGroup.Item
      variant="light"
      as="li"
      className="d-flex justify-content-between align-items-start list-item-compact"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="me-1">
        <span className="fw-bold h2">
          {routeId}
          <span className="h6 route-direction-desc">{routeDirection.desc}</span>
        </span>
        <br />
        <div className="stop-location-text">
          <div>
            at {stopName} ({stop.locid})
            {hasMultipleStops && (
              <span className="text-muted stop-info-meta">
                {currentStopIndex !== undefined && totalStops !== undefined && (
                  <>
                    (Stop {currentStopIndex + 1} of {totalStops})
                    {onCycleStop && (
                      <span className="stop-cycler">
                        <button
                          className="btn btn-sm btn-link p-0 stop-cycle-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCycleStop('prev');
                          }}
                          title="Previous stop"
                        >
                          ◄
                        </button>
                        <button
                          className="btn btn-sm btn-link p-0 ms-1 stop-cycle-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCycleStop('next');
                          }}
                          title="Next stop"
                        >
                          ►
                        </button>
                      </span>
                    )}
                  </>
                )}
              </span>
            )}
          </div>
          <DistanceDisplay 
            distanceString={distanceString} 
            currentLocation={currentLocation} 
            stopLocation={stop} 
          />
        </div>
      </div>

      {arrival && estimatedArrivalTime && scheduledArrivalTime && (
        <div className="mt-1 arrival-timestamps">
          <ArrivalTimestamp 
            estimatedArrivalTime={estimatedArrivalTime} 
            scheduledArrivalTime={scheduledArrivalTime} 
          />
          {subsequentArrivals.map((arrival, index) => (
            <div key={index} className="text-muted">
              <ArrivalTimestamp 
                estimatedArrivalTime={arrival.estimated} 
                scheduledArrivalTime={arrival.scheduled} 
              />
            </div>
          ))}
        </div>
      )}
    </ListGroup.Item>
  );
}

export default SimpleArrivalListItem;
