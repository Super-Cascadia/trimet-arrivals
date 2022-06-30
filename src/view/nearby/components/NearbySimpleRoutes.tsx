import { Dictionary, each, filter, groupBy, join, map } from "lodash";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { getArrivals } from "../../../api/trimet/arrivals";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import {
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
import SimpleArrivalListItem from "./common/SimpleArrivalListItem";
import "./NearbyRoutes.scss";
import NearbySubNav from "./NearbySubNav";
import { SearchRadiusSelection } from "./SearchRadiusSelection";

interface Props {
  nearbyRoutes: Dictionary<TrimetRoute[]>;
  nearbyStops: StopData;
  radiusSize: number;
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
      const routeDirection = route?.dir[0]?.dir;
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

  return { closestNearbyRouteStructure };
}

export default function NearbySimpleRoutes({
  nearbyStops,
  nearbyRoutes,
  radiusSize,
  handleRadiusSelectionChange,
  routeCount,
  stopCount
}: Props) {
  const [arrivalData, setArrivalData] = useState<ArrivalData>(null);

  useEffect(() => {
    async function fetchData() {
      if (nearbyStops) {
        const locationIds = join(
          map(nearbyStops?.location, loc => loc.locid),
          ","
        );

        const arrivals = await getArrivals(locationIds, 90);
        setArrivalData(arrivals);
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

  return (
    <div id="nearby-view-routes" className="scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
      />
      <br />
      <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
      <br />
      <ListGroup>
        {map(
          closestNearbyRouteStructure,
          (route: RouteStructure, index: number) => {
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
          }
        )}
      </ListGroup>
    </div>
  );
}
