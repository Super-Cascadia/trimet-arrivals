import { map } from "lodash";
import React from "react";
import { ListGroup } from "react-bootstrap";
import {
  StopData,
  StopLocation,
} from "../../../../../api/trimet/interfaces/types";
import { getNormalizedDistanceString } from "../../../util/turfUtils";
import { StopHeading } from "./StopHeading";
import { RouteArrivalCard } from "../cards/RouteArrivalCard";

/**
 * Props for the NearbyLocationList component
 */
interface NearbyLocationListProps {
  /** Stop location data containing all stops and their routes */
  stopLocations: StopData;
  /** Current user location as [longitude, latitude] */
  currentLocation: number[];
  /** Set of stop IDs that match the current filter */
  selectedStops: Set<number>;
  /** Set of route-direction combinations in the format "routeId-direction" */
  routeDirectionFilter: Set<string>;
  /** Whether stop filtering is active */
  hasStopFiltering: boolean;
  /** Whether route filtering is active */
  hasRouteFiltering: boolean;
  /** Optional callback to highlight a stop marker on the map */
  highlightStopMarker?: (stopId: string | null) => void;
}

/**
 * Displays a list of nearby transit stops with their routes and arrival times.
 * Supports filtering by stop and route/direction, and shows distance from current location.
 * 
 * @param props - Component props
 * @returns A list of stop locations with route arrival information
 */
export function NearbyLocationList({
  stopLocations,
  currentLocation,
  selectedStops,
  routeDirectionFilter,
  hasStopFiltering,
  hasRouteFiltering,
  highlightStopMarker
}: NearbyLocationListProps) {
  return (
    <>
      {map(stopLocations.location, (stopLocation: StopLocation, key: number) => {
        const isStopMatch = selectedStops.has(stopLocation.locid);
        const distanceDescription = getNormalizedDistanceString(currentLocation, [
          stopLocation.lng,
          stopLocation.lat
        ]);
        
        // Get filtered routes based on direction filter
        const filteredRoutes = stopLocation.route.filter(r => {
          if (!hasRouteFiltering) return true;
          // Check if any direction of this route matches the filter
          return r.dir.some(d => routeDirectionFilter.has(`${r.route}-${d.dir}`));
        });
        
        // Filter by stop and route
        if (hasStopFiltering && hasRouteFiltering) {
          if (!isStopMatch && filteredRoutes.length === 0) {
            return null;
          }
        } else if (hasStopFiltering) {
          if (!isStopMatch) {
            return null;
          }
        } else if (hasRouteFiltering) {
          if (filteredRoutes.length === 0) {
            return null;
          }
        }
        return (
          <li 
            key={key} 
            className="stop-section"
            onMouseEnter={() => highlightStopMarker && highlightStopMarker(stopLocation.locid.toString())}
            onMouseLeave={() => highlightStopMarker && highlightStopMarker(null)}
          >
            {/* Stop heading (not a card) */}
            <StopHeading 
              stopLocation={stopLocation}
              currentLocation={currentLocation}
              distanceDescription={distanceDescription}
            />
            {/* Route arrivals as list group items */}
            <ListGroup className="mb-3">
              {filteredRoutes.map(route => {
                const filteredDirections = hasRouteFiltering
                  ? route.dir.filter(d => routeDirectionFilter.has(`${route.route}-${d.dir}`))
                  : route.dir;
                
                return filteredDirections.map(direction => (
                  <RouteArrivalCard 
                    key={`${route.route}-${direction.dir}`}
                    route={route}
                    direction={direction}
                    stopId={stopLocation.locid}
                  />
                ));
              })}
            </ListGroup>
          </li>
        );
      })}
    </>
  );
}
