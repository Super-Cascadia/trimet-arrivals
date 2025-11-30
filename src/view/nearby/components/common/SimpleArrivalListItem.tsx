import React from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import {
  Direction,
  StopLocation,
  TrimetRoute
} from "../../../../api/trimet/interfaces/types";
import { ArrivalCountdown } from "./ArrivalCountdown";
import { ArrivalTimestamp } from "./ArrivalTimestamp";
import { DistanceDisplay } from "./DistanceDisplay";
import { StatusIndicator } from "./StatusIndicator";
import "./SimpleArrivalListItem.scss";

interface ArrivalListItemParams {
  id: any;
  arrival: Arrival;
  nextArrival?: Arrival;
  thirdArrival?: Arrival;
  fourthArrival?: Arrival;
  route: TrimetRoute;
  stop: StopLocation;
  distanceString?: string;
  currentLocation?: number[];
  hasMultipleStops?: boolean;
  currentStopIndex?: number;
  totalStops?: number;
  onCycleStop?: (direction: 'prev' | 'next') => void;
  onHover?: (stopId: string | null) => void;
}

function SimpleArrivalListItem({
  id,
  arrival,
  nextArrival,
  thirdArrival,
  fourthArrival,
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

  if (!arrival || !route || !stop) {
    return null;
  }

  const estimatedArrivalTime = arrival.estimated;
  const scheduledArrivalTime = arrival.scheduled;
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

  const subsequentArrivals = [nextArrival, thirdArrival, fourthArrival].filter((a): a is Arrival => !!a);

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
              <span className="text-muted" style={{ marginLeft: '8px', fontSize: '0.85em' }}>
                {currentStopIndex !== undefined && totalStops !== undefined && (
                  <>
                    (Stop {currentStopIndex + 1} of {totalStops})
                    {onCycleStop && (
                      <span style={{ marginLeft: '6px' }}>
                        <button
                          className="btn btn-sm btn-link p-0"
                          style={{ fontSize: '0.9em', textDecoration: 'none' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCycleStop('prev');
                          }}
                          title="Previous stop"
                        >
                          ◄
                        </button>
                        <button
                          className="btn btn-sm btn-link p-0 ms-1"
                          style={{ fontSize: '0.9em', textDecoration: 'none' }}
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

      {subsequentArrivals.length > 0 && (
        <div className="mt-1" style={{ fontSize: '0.75em' }}>
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
