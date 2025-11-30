import { Dictionary, isEmpty, join, map } from "lodash";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ListGroup } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { getArrivals } from "../../../api/trimet/arrivals";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import {
  StopData,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import NearbySubNav from "./common/NearbySubNav";
import SimpleArrivalListItem from "./common/SimpleArrivalListItem";
import SimpleArrivalListItemSkeleton from "./common/SimpleArrivalListItemSkeleton";
import NearbySkeletonList from "./common/NearbySkeleton";
import "./NearbyRoutes.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";
import { getRouteArrivals, RouteStructure, enrichRouteStructure, sortRoutesByBookmarkAndDistance } from "../util/routeArrivals";

/**
 * Props for the NearbySimpleRoutes component
 */
interface Props {
  /** Dictionary of routes grouped by some key */
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  /** Stop data containing all nearby stops */
  nearbyStops: StopData;
  /** Radius size in meters for the search area */
  radiusSize: number;
  /** Flag to enforce minimum loading time for better UX */
  minLoadingTime?: boolean;
  /** Callback when simple routes view is opened with labeled stops for map display */
  handleSimpleRoutesOpened: (labeledStops?: Array<{locid: number, label: string, lng: number, lat: number}>) => void;
  /** Callback when radius selection changes */
  handleRadiusSelectionChange: (e: any) => void;
  /** Optional callback to refresh data */
  handleRefresh?: () => void;
  /** Optional callback to find routes near user's current location */
  handleFindNearMe?: () => void;
  /** Total count of routes found */
  routeCount: number;
  /** Total count of stops found */
  stopCount: number;
  /** Current user location as [longitude, latitude] */
  currentLocation: number[];
  /** Optional callback to highlight a stop marker on the map */
  highlightStopMarker?: (stopId: string | null) => void;
}



/**
 * NearbySimpleRoutes component displays a list of nearby transit routes with arrival times.
 * 
 * Features:
 * - Groups routes by route ID and direction
 * - Shows multiple stops for the same route-direction (user can cycle through them)
 * - Sorts routes: bookmarked first, then by distance
 * - Separates routes with arrivals from routes not currently in service
 * - Allows filtering routes using a multi-select dropdown
 * - Displays stop markers on the map with stop IDs as labels
 * - Fetches arrivals for the remainder of the current day to determine service status
 * 
 * @param props - Component props
 * @returns React component displaying nearby routes and arrivals
 */
export default function NearbySimpleRoutes({
  nearbyStops,
  nearbyRoutes,
  radiusSize,
  minLoadingTime = false,
  handleRadiusSelectionChange,
  handleSimpleRoutesOpened,
  handleRefresh,
  handleFindNearMe,
  routeCount,
  stopCount,
  currentLocation,
  highlightStopMarker
}: Props) {
  const location = useLocation();
  const [arrivalData, setArrivalData] = useState<ArrivalData>(null);
  const [routeFilter, setRouteFilter] = useState<string[]>([]);
  const [stopIndexMap, setStopIndexMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    async function fetchData() {
      if (nearbyStops) {
        const locationIds = join(
          map(nearbyStops?.location, loc => loc.locid),
          ","
        );

        // Fetch arrivals for the remainder of the current day to determine "Not in service" status
        const now = moment();
        const endOfDay = moment().endOf('day');
        const minutesUntilEndOfDay = endOfDay.diff(now, 'minutes');
        // Ensure we request at least 24 hours to get next available times
        const minutes = Math.max(1440, minutesUntilEndOfDay);

        const arrivals = await getArrivals(locationIds, minutes);
        setArrivalData(arrivals);
      }
    }
    fetchData();
  }, [nearbyStops]);

  const isLoading = !nearbyStops || !arrivalData || minLoadingTime;

  const { closestNearbyRouteStructure } = isLoading
    ? { closestNearbyRouteStructure: [] }
    : getRouteArrivals(arrivalData, nearbyStops, currentLocation);

  // Apply current stop indices to route structures
  const routeStructureWithStopIndices = enrichRouteStructure(
    closestNearbyRouteStructure,
    arrivalData,
    stopIndexMap,
    currentLocation
  );

  // Handler to cycle through stops for a route-direction
  const handleCycleStop = (routeId: number, dir: number, direction: 'prev' | 'next') => {
    const routeDirectionId = `${routeId}-${dir}`;
    const route = routeStructureWithStopIndices.find(r => r.id === routeId && r.dir === dir);
    
    if (route?.allStopsForRoute && route.allStopsForRoute.length > 1) {
      const currentIndex = stopIndexMap.get(routeDirectionId) || 0;
      let nextIndex: number;
      
      if (direction === 'next') {
        nextIndex = (currentIndex + 1) % route.allStopsForRoute.length;
      } else {
        nextIndex = (currentIndex - 1 + route.allStopsForRoute.length) % route.allStopsForRoute.length;
      }
      
      setStopIndexMap(new Map(stopIndexMap.set(routeDirectionId, nextIndex)));
    }
  };

  // Separate routes with and without arrivals
  const routesWithArrivals = !isEmpty(routeStructureWithStopIndices)
    ? routeStructureWithStopIndices.filter(r => r.arrivals && r.arrivals.length > 0)
    : [];
  const routesWithoutArrivals = !isEmpty(routeStructureWithStopIndices)
    ? routeStructureWithStopIndices.filter(r => !r.arrivals || r.arrivals.length === 0)
    : [];

  // Sort routes with arrivals - bookmarked first, then by distance
  const sortedRoutesWithArrivals = sortRoutesByBookmarkAndDistance(routesWithArrivals);

  // Sort routes without arrivals - bookmarked first, then by distance
  const sortedRoutesWithoutArrivals = sortRoutesByBookmarkAndDistance(routesWithoutArrivals);

  // Combine for backwards compatibility with filter/options
  const sortedNearbyRouteStructure = [
    ...sortedRoutesWithArrivals,
    ...sortedRoutesWithoutArrivals
  ];

  // Assign stop ID as label to each route
  const routesWithLabels = sortedNearbyRouteStructure.map((route) => ({
    ...route,
    stopLabel: route.stop.locid.toString() // Use stop ID as label
  }));

  // Update filtered lists with labels
  const labeledRoutesMap = new Map(routesWithLabels.map(r => [`${r.id}-${r.dir}-${r.stop.locid}`, r.stopLabel]));

  // Call handleSimpleRoutesOpened when we have nearby stops
  // This runs on mount and when data changes
  useEffect(() => {
    console.log('[NearbySimpleRoutes] useEffect triggered - isLoading:', isLoading, 'nearbyStops:', nearbyStops);
    
    if (!isLoading && nearbyStops?.location) {
      // Show ALL stops in the search area on the map with their stop IDs
      const labeledStops = nearbyStops.location.map(stop => ({
        locid: stop.locid,
        label: stop.locid.toString(),
        lng: stop.lng,
        lat: stop.lat
      }));
      
      console.log('[NearbySimpleRoutes] Calling handleSimpleRoutesOpened with', labeledStops.length, 'labeled stops (all stops in search area):', labeledStops);
      handleSimpleRoutesOpened(labeledStops);
    } else {
      console.log('[NearbySimpleRoutes] Skipping handleSimpleRoutesOpened - conditions not met');
    }
    
    // Cleanup: this component manages the simple routes view markers
    // When it unmounts (navigating to detail page), markers will be managed by that page
  }, [isLoading, nearbyStops]);

  // Build select options from the nearby route structure
  const routeOptions = isLoading
    ? []
    : (sortedNearbyRouteStructure || []).map(r => {
        const directionObj = r.route.dir.find(d => d.dir === r.dir);
        const directionLabel = directionObj?.desc || `Dir ${r.dir}`;
        const routeDirectionId = `${r.id}-${r.dir}`;
        return {
          label: `${r.route.desc} – ${directionLabel} (${routeDirectionId})`,
          value: routeDirectionId
        };
      });

  const handleRouteFilterChange = (selected: any) => {
    const values = selected.map((o: any) => o.value);
    setRouteFilter(values);
  };

  // Apply filters to both groups and add labels
  const filteredRoutesWithArrivals = (routeFilter.length
    ? routesWithLabels.filter(r =>
        routeFilter.includes(`${r.id}-${r.dir}`) && r.arrivals && r.arrivals.length > 0
      )
    : routesWithLabels.filter(r => r.arrivals && r.arrivals.length > 0));

  const filteredRoutesWithoutArrivals = (routeFilter.length
    ? routesWithLabels.filter(r =>
        routeFilter.includes(`${r.id}-${r.dir}`) && (!r.arrivals || r.arrivals.length === 0)
      )
    : routesWithLabels.filter(r => !r.arrivals || r.arrivals.length === 0));

  return (
    <div id="nearby-view-routes" className="scrollarea">
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
        options={routeOptions}
        onChange={handleRouteFilterChange}
        placeholder="Filter routes..."
        classNamePrefix="nearby-route-filter"
        value={routeOptions.filter(o => routeFilter.includes(o.value))}
        isDisabled={isLoading}
      />
      <br />
      <ListGroup>
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <SimpleArrivalListItemSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        ) : (
          <>
            {map(filteredRoutesWithArrivals, (route: RouteStructure, index: number) => {
              const stop = route.stop;
              const hasMultipleStops = route.allStopsForRoute && route.allStopsForRoute.length > 1;
              return (
                <SimpleArrivalListItem
                  key={`with-arrival-${index}`}
                  id={stop.locid}
                  arrivals={route.arrivals}
                  route={route.route}
                  stop={stop}
                  distanceString={route.distanceString}
                  currentLocation={currentLocation}
                  hasMultipleStops={hasMultipleStops}
                  currentStopIndex={route.currentStopIndex || 0}
                  totalStops={route.allStopsForRoute?.length || 1}
                  onCycleStop={(direction) => handleCycleStop(route.id, route.dir, direction)}
                  onHover={highlightStopMarker}
                />
              );
            })}
          </>
        )}
      </ListGroup>
      
      {!isLoading && filteredRoutesWithoutArrivals.length > 0 && (
        <>
          <div className="text-center my-3 pt-2 border-top">
            <h6 className="text-muted text-uppercase fw-bold" style={{ letterSpacing: '1px' }}>Not in service</h6>
          </div>
          <ListGroup>
            {map(filteredRoutesWithoutArrivals, (route: RouteStructure, index: number) => {
              const nextFutureArrival = route.futureArrivals?.[0];
              const stop = route.stop;
              const hasMultipleStops = route.allStopsForRoute && route.allStopsForRoute.length > 1;
              return (
                <SimpleArrivalListItem
                  key={`without-arrival-${index}`}
                  id={stop.locid}
                  arrivals={nextFutureArrival ? [nextFutureArrival] : []}
                  route={route.route}
                  stop={stop}
                  distanceString={route.distanceString}
                  currentLocation={currentLocation}
                  hasMultipleStops={hasMultipleStops}
                  currentStopIndex={route.currentStopIndex || 0}
                  totalStops={route.allStopsForRoute?.length || 1}
                  onCycleStop={(direction) => handleCycleStop(route.id, route.dir, direction)}
                  onHover={highlightStopMarker}
                />
              );
            })}
          </ListGroup>
        </>
      )}
    </div>
  );
}
