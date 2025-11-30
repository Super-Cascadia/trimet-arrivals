import { map } from "lodash";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import { getArrivals } from "../../../api/trimet/arrivals";
import { Arrival } from "../../../api/trimet/interfaces/arrivals";
import RouteIndicator from "../../../component/route/RouteIndicator";
import StopLocationIndicator from "../../../component/stop/StopLocationIndicator";
import NearbySkeletonList from "./common/NearbySkeleton";
import { getNormalizedDistanceString } from "../util/turfUtils";
import NearbySubNav from "./common/NearbySubNav";
import { ArrivalCountdown } from "./common/ArrivalCountdown";
import { StatusIndicator } from "./common/StatusIndicator";
import "./NearbyViewComponent.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

interface RouteArrivalCardProps {
  route: TrimetRoute;
  direction: any;
  stopId: number;
}

function RouteArrivalCard({ route, direction, stopId }: RouteArrivalCardProps) {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArrivals() {
      try {
        const arrivalData = await getArrivals(stopId.toString(), 45);
        // Filter arrivals for this specific route and direction
        const filtered = arrivalData.arrival.filter(
          (a: Arrival) => a.route === route.route && a.dir === direction.dir
        );
        setArrivals(filtered.slice(0, 4)); // Get up to 4 arrivals
        setLoading(false);
      } catch (error) {
        console.error('Error fetching arrivals:', error);
        setLoading(false);
      }
    }

    fetchArrivals();
    const interval = setInterval(fetchArrivals, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [route.route, direction.dir, stopId]);

  const formatArrivalTime = (timestamp: number) => {
    return timestamp 
      ? new Date(timestamp).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      : '';
  };

  if (loading) {
    return (
      <ListGroup.Item variant="light" className="d-flex justify-content-between align-items-start list-item-compact">
        <div className="me-1">
          <span className="fw-bold h2">
            {route.route}
            <span className="h6 route-direction-desc">{direction.desc}</span>
          </span>
        </div>
        <div className="text-end arrival-time-container flex-shrink-0">
          <span className="text-muted">Loading...</span>
        </div>
      </ListGroup.Item>
    );
  }

  if (arrivals.length === 0) {
    return (
      <ListGroup.Item variant="light" className="d-flex justify-content-between align-items-start list-item-compact">
        <div className="me-1">
          <span className="fw-bold h2">
            {route.route}
            <span className="h6 route-direction-desc">{direction.desc}</span>
          </span>
        </div>
        <div className="text-end arrival-time-container flex-shrink-0">
          <span className="text-muted">No arrivals</span>
        </div>
      </ListGroup.Item>
    );
  }

  const [firstArrival, ...additionalArrivals] = arrivals;

  const handleCardClick = () => {
    const url = `/nearby/simple-routes/${route.route}?stop=${stopId}&direction=${direction.dir}`;
    navigate(url);
  };

  return (
    <ListGroup.Item 
      variant="light" 
      className="d-flex justify-content-between align-items-start list-item-compact"
      action
      onClick={handleCardClick}
    >
      <div className="me-1">
        <span className="fw-bold h2 route-number">
          {route.route}
          <span className="h6 route-direction-desc">{direction.desc}</span>
        </span>
      </div>
      <div className="text-end arrival-time-container flex-shrink-0">
        <ul className="list-unstyled mb-0">
          <li className="fw-bold">
            <span className="countdown">
              <ArrivalCountdown
                estimatedArrivalTime={firstArrival.estimated}
                scheduledArrivalTime={firstArrival.scheduled}
              />
            </span>
            {formatArrivalTime(firstArrival.estimated || firstArrival.scheduled) && (
              <span className="text-muted exact-time"> | {formatArrivalTime(firstArrival.estimated || firstArrival.scheduled)}</span>
            )}
            <StatusIndicator estimated={firstArrival.estimated} scheduled={firstArrival.scheduled} />
          </li>
          {additionalArrivals.map((arrival, idx) => (
            <li key={idx} className="text-muted">
              <span className="countdown">
                <ArrivalCountdown
                  estimatedArrivalTime={arrival.estimated}
                  scheduledArrivalTime={arrival.scheduled}
                />
              </span>
              {formatArrivalTime(arrival.estimated || arrival.scheduled) && (
                <span className="exact-time"> | {formatArrivalTime(arrival.estimated || arrival.scheduled)}</span>
              )}
              <StatusIndicator estimated={arrival.estimated} scheduled={arrival.scheduled} />
            </li>
          ))}
        </ul>
      </div>
    </ListGroup.Item>
  );
}

function getDirectionArrow(currentLocation: number[], stopLocation: StopLocation): string {
  if (!currentLocation || !stopLocation) return "";
  
  // Calculate bearing from current location to stop
  const lat1 = currentLocation[1] * Math.PI / 180;
  const lat2 = stopLocation.lat * Math.PI / 180;
  const dLon = (stopLocation.lng - currentLocation[0]) * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  
  // Normalize to 0-360
  const normalizedBearing = (bearing + 360) % 360;
  
  // Convert to 8-direction arrow (N, NE, E, SE, S, SW, W, NW)
  const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const index = Math.round(normalizedBearing / 45) % 8;
  
  return directions[index];
}

function getLocationInfo(
  stopLocations: StopData,
  currentLocation: number[],
  selectedStops: Set<number>,
  routeDirectionFilter: Set<string>,
  hasStopFiltering: boolean,
  hasRouteFiltering: boolean,
  highlightStopMarker?: (stopId: string | null) => void
) {
  return map(stopLocations.location, (stopLocation: StopLocation, key: number) => {
    const isStopMatch = selectedStops.has(stopLocation.locid);
    const distanceDescription = getNormalizedDistanceString(currentLocation, [
      stopLocation.lng,
      stopLocation.lat
    ]);
    const directionArrow = getDirectionArrow(currentLocation, stopLocation);
    
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
        <h2 className="stop-heading">
          <StopLocationIndicator
            locationId={stopLocation.locid}
            nearbyStops={true}
          />
          <div className="stop-info">
            <div>
              {stopLocation.desc}
              {stopLocation.dir && (
                <span className="text-muted" style={{ marginLeft: '8px', fontSize: '0.9em' }}>
                  ({stopLocation.dir})
                </span>
              )}
            </div>
            {/* Distance directly below stop name */}
            <div className="stop-distance">
              {directionArrow && <span style={{ marginRight: '4px' }}>{directionArrow}</span>}
              {distanceDescription}
            </div>
          </div>
        </h2>
        
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
  });
}

export interface NearbyStopsProps {
  nearbyStops: StopData;
  radiusSize: number;
  handleRadiusSelectionChange: (e: any) => void;
  handleRefresh?: () => void;
  handleFindNearMe?: () => void;
  stopCount: number;
  routeCount: number;
  currentLocation: number[];
  highlightStopMarker?: (stopId: string | null) => void;
}

export default function NearbyStops({
  nearbyStops,
  radiusSize,
  handleRadiusSelectionChange,
  handleRefresh,
  handleFindNearMe,
  routeCount,
  stopCount,
  currentLocation,
  highlightStopMarker
}: NearbyStopsProps) {
  const isLoading = !nearbyStops;

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const routeDirectionOptions: { label: string; value: string }[] = [];
  const stopOptions: { label: string; value: string }[] = [];
  if (!isLoading) {
    const seenRouteDirections: Set<string> = new Set();
    const seenStops: Set<number> = new Set();
    nearbyStops.location.forEach(loc => {
      if (!seenStops.has(loc.locid)) {
        seenStops.add(loc.locid);
        stopOptions.push({
          label: `Stop ${loc.locid} – ${loc.desc}`,
          value: `stop:${loc.locid}`
        });
      }
      (loc.route || []).forEach(r => {
        r.dir.forEach(d => {
          const composite = `${r.route}-${d.dir}`;
          if (!seenRouteDirections.has(composite)) {
            seenRouteDirections.add(composite);
            routeDirectionOptions.push({
              label: `Route ${r.route} – ${r.desc} – ${d.desc}`,
              value: `route:${composite}`
            });
          }
        });
      });
    });
  }

  const groupedOptions = [
    { label: "Stops", options: stopOptions },
    { label: "Routes", options: routeDirectionOptions }
  ];

  const handleFilterChange = (selected: any) => {
    const values = selected.map((o: any) => o.value);
    setSelectedValues(values);
  };

  const selectedStops = new Set<number>();
  const selectedRouteDirections = new Set<string>();
  selectedValues.forEach(v => {
    if (v.startsWith("stop:")) {
      const id = Number(v.split(":")[1]);
      selectedStops.add(id);
    } else if (v.startsWith("route:")) {
      selectedRouteDirections.add(v.replace("route:", ""));
    }
  });
  const hasStopFiltering = selectedStops.size > 0;
  const hasRouteFiltering = selectedRouteDirections.size > 0;

  return (
    <div className="stops-wrapper scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
        handleRefresh={handleRefresh}
        handleFindNearMe={handleFindNearMe}
      />
      <br />
      <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
      <br />
      <Select
        isMulti
        options={groupedOptions}
        onChange={handleFilterChange}
        placeholder="Filter stops or routes..."
        classNamePrefix="nearby-route-filter"
        className="nearby-filter-container"
        value={groupedOptions
          .map(g => g.options)
          .flat()
          .filter(o => selectedValues.includes(o.value))}
      />
      {isLoading ? (
        <NearbySkeletonList />
      ) : (
        <ul className="list-unstyled">
          {getLocationInfo(
            nearbyStops,
            currentLocation,
            selectedStops,
            selectedRouteDirections,
            hasStopFiltering,
            hasRouteFiltering,
            highlightStopMarker
          )}
        </ul>
      )}
    </div>
  );
}
