import { Dictionary, each, filter, groupBy, isEmpty, join, map } from "lodash";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { ListGroup } from "react-bootstrap";
import { getArrivals } from "../../../api/trimet/arrivals";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import {
  StopData,
  StopLocation,
  TrimetRoute,
  Direction
} from "../../../api/trimet/interfaces/types";
import NearbySubNav from "./common/NearbySubNav";
import SimpleArrivalListItem from "./common/SimpleArrivalListItem";
import SimpleArrivalListItemSkeleton from "./common/SimpleArrivalListItemSkeleton";
import NearbySkeletonList from "./common/NearbySkeleton";
import "./NearbyRoutes.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";
import { getDistance, getNormalizedDistanceString } from "../util/turfUtils";
import { isRouteBookmarkedInGroups } from '../../../api/localstorage/bookmarkGroups.localstorage';

interface Props {
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  minLoadingTime?: boolean;
  handleSimpleRoutesOpened: () => void;
  handleRadiusSelectionChange: (e: any) => void;
  handleRefresh?: () => void;
  handleFindNearMe?: () => void;
  routeCount: number;
  stopCount: number;
  currentLocation: number[];
}

interface RouteStructure {
  route: TrimetRoute;
  arrivals: Arrival[];
  stop: StopLocation;
  dir: number;
  id: number;
  distance: number;
  distanceString: string;
  allStopsForRoute?: StopLocation[]; // All stops serving this route-direction
  currentStopIndex?: number; // Index of currently displayed stop
  stopLabel?: string; // Letter label (A, B, C, etc.)
}
function getRouteArrivals(
  arrivalData: ArrivalData,
  nearbyStops: StopData,
  currentLocation: number[]
): {
  closestNearbyRouteStructure: RouteStructure[];
} {
  const groupedArrivals = groupBy(arrivalData?.arrival, "locid");
  const routeDirectionMap = new Map<string, RouteStructure>();

  // First pass: collect all stops for each route-direction
  each(nearbyStops?.location, (stop: StopLocation) => {
    const stopLocation = [stop.lng, stop.lat];
    const distance = getDistance(currentLocation, stopLocation);
    const distanceString = getNormalizedDistanceString(currentLocation, stopLocation);
    
    each(stop?.route, (route: TrimetRoute) => {
      const routeId = route?.route;
      // Iterate all directions to differentiate each direction explicitly
      each(route?.dir, (direction: Direction) => {
        const routeDirection = direction.dir;
        const routeDirectionId = `${routeId}-${routeDirection}`;
        
        const arrivalsForLocation = groupedArrivals[stop.locid];
        const arrivals = filter(arrivalsForLocation, (arrival: Arrival) => {
          return arrival.route === routeId && arrival.dir === routeDirection;
        });
        
        if (!routeDirectionMap.has(routeDirectionId)) {
          // First stop for this route-direction - create entry
          routeDirectionMap.set(routeDirectionId, {
            arrivals,
            dir: routeDirection,
            id: routeId,
            route,
            stop,
            distance,
            distanceString,
            allStopsForRoute: [stop],
            currentStopIndex: 0
          });
        } else {
          // Additional stop for this route-direction - add to array
          const existing = routeDirectionMap.get(routeDirectionId)!;
          existing.allStopsForRoute!.push(stop);
        }
      });
    });
  });

  // Sort stops within each route-direction by distance
  routeDirectionMap.forEach((value) => {
    if (value.allStopsForRoute && value.allStopsForRoute.length > 1) {
      value.allStopsForRoute.sort((a, b) => {
        const distA = getDistance(currentLocation, [a.lng, a.lat]);
        const distB = getDistance(currentLocation, [b.lng, b.lat]);
        return distA - distB;
      });
      // Update the main stop to be the closest one
      value.stop = value.allStopsForRoute[0];
      const closestLocation = [value.stop.lng, value.stop.lat];
      value.distance = getDistance(currentLocation, closestLocation);
      value.distanceString = getNormalizedDistanceString(currentLocation, closestLocation);
    }
  });

  return { closestNearbyRouteStructure: Array.from(routeDirectionMap.values()) };
}

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
  currentLocation
}: Props) {
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

        const arrivals = await getArrivals(locationIds, 90);
        setArrivalData(arrivals);
        handleSimpleRoutesOpened();
      }
    }
    fetchData();
  }, [nearbyStops]);

  const isLoading = !nearbyStops || !arrivalData || minLoadingTime;

  const { closestNearbyRouteStructure } = isLoading
    ? { closestNearbyRouteStructure: [] }
    : getRouteArrivals(arrivalData, nearbyStops, currentLocation);

  // Apply current stop indices to route structures
  const routeStructureWithStopIndices = closestNearbyRouteStructure.map(route => {
    const routeDirectionId = `${route.id}-${route.dir}`;
    const currentIndex = stopIndexMap.get(routeDirectionId) || 0;
    
    if (route.allStopsForRoute && route.allStopsForRoute.length > 1) {
      // Update to show the currently selected stop
      const selectedStop = route.allStopsForRoute[currentIndex];
      const selectedLocation = [selectedStop.lng, selectedStop.lat];
      
      // Get arrivals for the selected stop
      const groupedArrivals = groupBy(arrivalData?.arrival, "locid");
      const arrivalsForLocation = groupedArrivals[selectedStop.locid];
      const arrivals = filter(arrivalsForLocation, (arrival: Arrival) => {
        return arrival.route === route.id && arrival.dir === route.dir;
      });
      
      return {
        ...route,
        stop: selectedStop,
        distance: getDistance(currentLocation, selectedLocation),
        distanceString: getNormalizedDistanceString(currentLocation, selectedLocation),
        arrivals,
        currentStopIndex: currentIndex
      };
    }
    return route;
  });

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
  const sortedRoutesWithArrivals = routesWithArrivals.sort((a, b) => {
    const aBookmarked = isRouteBookmarkedInGroups(a.id, a.stop.locid, a.dir);
    const bBookmarked = isRouteBookmarkedInGroups(b.id, b.stop.locid, b.dir);
    
    if (aBookmarked && !bBookmarked) return -1;
    if (!aBookmarked && bBookmarked) return 1;
    
    return a.distance - b.distance;
  });

  // Sort routes without arrivals - bookmarked first, then by distance
  const sortedRoutesWithoutArrivals = routesWithoutArrivals.sort((a, b) => {
    const aBookmarked = isRouteBookmarkedInGroups(a.id, a.stop.locid, a.dir);
    const bBookmarked = isRouteBookmarkedInGroups(b.id, b.stop.locid, b.dir);
    
    if (aBookmarked && !bBookmarked) return -1;
    if (!aBookmarked && bBookmarked) return 1;
    
    return a.distance - b.distance;
  });

  // Combine for backwards compatibility with filter/options
  const sortedNearbyRouteStructure = [
    ...sortedRoutesWithArrivals,
    ...sortedRoutesWithoutArrivals
  ];

  // Assign letter labels (A, B, C, etc.) to each route
  const routesWithLabels = sortedNearbyRouteStructure.map((route, index) => ({
    ...route,
    stopLabel: String.fromCharCode(65 + index) // A=65, B=66, etc.
  }));

  // Update filtered lists with labels
  const labeledRoutesMap = new Map(routesWithLabels.map(r => [`${r.id}-${r.dir}-${r.stop.locid}`, r.stopLabel]));

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
              const arrival = route.arrivals[0];
              const nextArrival = route.arrivals[1];
              const thirdArrival = route.arrivals[2];
              const fourthArrival = route.arrivals[3];
              const stop = route.stop;
              const hasMultipleStops = route.allStopsForRoute && route.allStopsForRoute.length > 1;
              return (
                <SimpleArrivalListItem
                  key={`with-arrival-${index}`}
                  id={stop.locid}
                  arrival={arrival}
                  nextArrival={nextArrival}
                  thirdArrival={thirdArrival}
                  fourthArrival={fourthArrival}
                  route={route.route}
                  stop={stop}
                  distanceString={route.distanceString}
                  currentLocation={currentLocation}
                  hasMultipleStops={hasMultipleStops}
                  currentStopIndex={route.currentStopIndex || 0}
                  totalStops={route.allStopsForRoute?.length || 1}
                  onCycleStop={(direction) => handleCycleStop(route.id, route.dir, direction)}
                  stopLabel={route.stopLabel}
                />
              );
            })}
            {filteredRoutesWithoutArrivals.length > 0 && filteredRoutesWithArrivals.length > 0 && (
              <ListGroup.Item variant="light" className="text-center" style={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #dee2e6', borderBottom: '2px solid #dee2e6' }}>
                <small className="text-muted fw-bold">— No arrivals scheduled —</small>
              </ListGroup.Item>
            )}
            {map(filteredRoutesWithoutArrivals, (route: RouteStructure, index: number) => {
              const arrival = route.arrivals[0];
              const nextArrival = route.arrivals[1];
              const thirdArrival = route.arrivals[2];
              const fourthArrival = route.arrivals[3];
              const stop = route.stop;
              const hasMultipleStops = route.allStopsForRoute && route.allStopsForRoute.length > 1;
              return (
                <SimpleArrivalListItem
                  key={`without-arrival-${index}`}
                  id={stop.locid}
                  arrival={arrival}
                  nextArrival={nextArrival}
                  thirdArrival={thirdArrival}
                  fourthArrival={fourthArrival}
                  route={route.route}
                  stop={stop}
                  distanceString={route.distanceString}
                  currentLocation={currentLocation}
                  hasMultipleStops={hasMultipleStops}
                  currentStopIndex={route.currentStopIndex || 0}
                  totalStops={route.allStopsForRoute?.length || 1}
                  onCycleStop={(direction) => handleCycleStop(route.id, route.dir, direction)}
                  stopLabel={route.stopLabel}
                />
              );
            })}
          </>
        )}
      </ListGroup>
    </div>
  );
}
