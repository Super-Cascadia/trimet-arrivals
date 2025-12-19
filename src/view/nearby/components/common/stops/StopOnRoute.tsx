import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { Badge, ListGroupItem } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RouteDirectionStop } from "../../../../../api/trimet/interfaces/routes";
import { StopData, TrimetRoute } from "../../../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../../../api/trimet/stops";
import StopLocationIndicator from "../../../../../component/stop/StopLocationIndicator";
import { RouteAtStop } from "./RouteAtStop";
import "./StopsOnRoute.scss";

interface StopOnRouteParams {
  routeDirectionStop: RouteDirectionStop;
  selectedArrival?: any;
  currentStopSeq?: number;
  allStopsOnRoute?: RouteDirectionStop[];
  downstreamArrivals?: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

/**
 * Component that displays a single stop on a route with its details and estimated arrival time.
 * 
 * @param {StopOnRouteParams} props - The component props
 * @param {RouteDirectionStop} props.routeDirectionStop - The stop information including location and description
 * @param {any} [props.selectedArrival] - The currently selected arrival/vehicle for tracking
 * @param {number} [props.currentStopSeq] - The sequence number of the current stop on the route
 * @param {RouteDirectionStop[]} [props.allStopsOnRoute] - Array of all stops on the route
 * @param {any} [props.downstreamArrivals] - API data containing arrival information for downstream stops
 * @param {boolean} [props.isSelected] - Whether this stop is currently selected
 * @param {() => void} [props.onSelect] - Callback function when the stop is selected
 * 
 * @returns {JSX.Element} A list item displaying the stop with radio button, name, location ID, routes at stop, and estimated arrival time
 */
export function StopOnRoute({ routeDirectionStop, selectedArrival, currentStopSeq, allStopsOnRoute, downstreamArrivals, isSelected, onSelect }: StopOnRouteParams) {
  const [stopData, setStopData] = useState<StopData>(null);

  useEffect(() => {
    async function fetchData() {
      if (routeDirectionStop) {
        const location = {
          coords: {
            latitude: routeDirectionStop.lat,
            longitude: routeDirectionStop.lng
          }
        };

        const nearbyStopData = await getNearbyStops(location, 10);
        setStopData(nearbyStopData);
      }
    }

    fetchData();
  }, [routeDirectionStop]);

  // Get actual estimated arrival time from API data
  const getEstimatedArrivalTime = () => {
    if (!selectedArrival || !downstreamArrivals) {
      return null;
    }

    // Find the arrival at this stop for the selected vehicle
    const arrivalAtThisStop = downstreamArrivals.arrival?.find(
      (arrival: any) => 
        arrival.locid === routeDirectionStop.locid && 
        arrival.vehicleID === selectedArrival.vehicleID &&
        arrival.route === selectedArrival.route &&
        arrival.dir === selectedArrival.dir
    );
    
    if (arrivalAtThisStop?.estimated) {
      return new Date(arrivalAtThisStop.estimated).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // Fallback to scheduled time if no estimate
    if (arrivalAtThisStop?.scheduled) {
      return new Date(arrivalAtThisStop.scheduled).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return null;
  };

  const estimatedTime = getEstimatedArrivalTime();

  return (
    <ListGroupItem 
      key={routeDirectionStop.locid} 
      className="d-flex justify-content-between align-items-center"
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
      onClick={onSelect}
    >
      <div className="d-flex align-items-center gap-2 flex-grow-1">
        <StopLocationIndicator 
          locationId={routeDirectionStop.locid} 
          nearbyStops={true} 
          selected={isSelected}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect();
          }}
        />
        <div>
          <span>{routeDirectionStop.desc}</span>
          {stopData && <RouteAtStop stopData={stopData} />}
        </div>
      </div>
      {estimatedTime && (
        <small className="text-muted stop-arrival-time">
          {estimatedTime}
        </small>
      )}
    </ListGroupItem>
  );
}
