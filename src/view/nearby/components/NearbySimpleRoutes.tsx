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
import "./NearbyRoutes.scss";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

interface Props {
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
  handleSimpleRoutesOpened: () => void;
  handleRadiusSelectionChange: (e: any) => void;
  routeCount: number;
  stopCount: number;
}

interface RouteStructure {
  route: TrimetRoute;
  arrivals: Arrival[];
  stop: StopLocation;
  dir: number;
  id: number;
}
function getRouteArrivals(
  arrivalData: ArrivalData,
  nearbyStops: StopData
): {
  closestNearbyRouteStructure: RouteStructure[];
} {
  const groupedArrivals = groupBy(arrivalData?.arrival, "locid");
  const closestNearbyRoutes: string[] = [];
  const closestNearbyRouteStructure: RouteStructure[] = [];

  each(nearbyStops?.location, (stop: StopLocation) => {
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
            stop
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
  handleRadiusSelectionChange,
  handleSimpleRoutesOpened,
  routeCount,
  stopCount
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

  if (!nearbyStops || !arrivalData) {
    return null;
  }

  const { closestNearbyRouteStructure } = getRouteArrivals(
    arrivalData,
    nearbyStops
  );

  const sortedNearbyRouteStructure =
    !isEmpty(closestNearbyRouteStructure) &&
    closestNearbyRouteStructure.sort((a, b) => {
      const aArrival = a.arrivals[0];
      const bArrival = b.arrivals[0];
      return (aArrival?.estimated ?? 0) - (bArrival?.estimated ?? 0);
    });

  // Build select options from the nearby route structure
  const routeOptions = (sortedNearbyRouteStructure || []).map(r => {
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

  const filteredStructure = routeFilter.length
    ? (sortedNearbyRouteStructure || []).filter(r =>
        routeFilter.includes(`${r.id}-${r.dir}`)
      )
    : sortedNearbyRouteStructure;

  return (
    <div id="nearby-view-routes" className="scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
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
      />
      <br />
      <ListGroup>
        {map(filteredStructure, (route: RouteStructure, index: number) => {
          const arrival = route.arrivals[0];
          const stop = route.stop;
          return (
            <SimpleArrivalListItem
              key={index}
              id={stop.locid}
              arrival={arrival}
              route={route.route}
              stop={stop}
            />
          );
        })}
      </ListGroup>
    </div>
  );
}
