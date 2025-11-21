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

interface Props {
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  minLoadingTime?: boolean;
  handleSimpleRoutesOpened: () => void;
  handleRadiusSelectionChange: (e: any) => void;
  handleRefresh?: () => void;
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
}
function getRouteArrivals(
  arrivalData: ArrivalData,
  nearbyStops: StopData,
  currentLocation: number[]
): {
  closestNearbyRouteStructure: RouteStructure[];
} {
  const groupedArrivals = groupBy(arrivalData?.arrival, "locid");
  const closestNearbyRoutes: string[] = [];
  const closestNearbyRouteStructure: RouteStructure[] = [];

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
        if (closestNearbyRoutes.indexOf(routeDirectionId) === -1) {
          const arrivalsForLocation = groupedArrivals[stop.locid];
          const arrivals = filter(arrivalsForLocation, (arrival: Arrival) => {
            return arrival.route === routeId && arrival.dir === routeDirection;
          });
          closestNearbyRoutes.push(routeDirectionId);
          closestNearbyRouteStructure.push({
            arrivals,
            dir: routeDirection,
            id: routeId,
            route,
            stop,
            distance,
            distanceString
          });
        }
      });
    });
  });

  return { closestNearbyRouteStructure };
}

export default function NearbySimpleRoutes({
  nearbyStops,
  nearbyRoutes,
  radiusSize,
  minLoadingTime = false,
  handleRadiusSelectionChange,
  handleSimpleRoutesOpened,
  handleRefresh,
  routeCount,
  stopCount,
  currentLocation
}: Props) {
  const [arrivalData, setArrivalData] = useState<ArrivalData>(null);
  const [routeFilter, setRouteFilter] = useState<string[]>([]);

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

  // Separate routes with and without arrivals
  const routesWithArrivals = !isEmpty(closestNearbyRouteStructure)
    ? closestNearbyRouteStructure.filter(r => r.arrivals && r.arrivals.length > 0)
    : [];
  const routesWithoutArrivals = !isEmpty(closestNearbyRouteStructure)
    ? closestNearbyRouteStructure.filter(r => !r.arrivals || r.arrivals.length === 0)
    : [];

  // Sort routes with arrivals by distance
  const sortedRoutesWithArrivals = routesWithArrivals.sort((a, b) => {
    return a.distance - b.distance;
  });

  // Sort routes without arrivals by distance
  const sortedRoutesWithoutArrivals = routesWithoutArrivals.sort((a, b) => {
    return a.distance - b.distance;
  });

  // Combine for backwards compatibility with filter/options
  const sortedNearbyRouteStructure = [
    ...sortedRoutesWithArrivals,
    ...sortedRoutesWithoutArrivals
  ];

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

  // Apply filters to both groups
  const filteredRoutesWithArrivals = routeFilter.length
    ? sortedRoutesWithArrivals.filter(r =>
        routeFilter.includes(`${r.id}-${r.dir}`)
      )
    : sortedRoutesWithArrivals;

  const filteredRoutesWithoutArrivals = routeFilter.length
    ? sortedRoutesWithoutArrivals.filter(r =>
        routeFilter.includes(`${r.id}-${r.dir}`)
      )
    : sortedRoutesWithoutArrivals;

  return (
    <div id="nearby-view-routes" className="scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
        handleRefresh={handleRefresh}
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
                />
              );
            })}
          </>
        )}
      </ListGroup>
    </div>
  );
}
