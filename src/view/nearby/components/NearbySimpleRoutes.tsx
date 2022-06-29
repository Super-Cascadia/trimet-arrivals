import { Dictionary, each, filter, groupBy, join, map, slice } from "lodash";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { getArrivals } from "../../../api/trimet/arrivals";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import {
  StopData,
  StopLocation,
  TrimetRoute
} from "../../../api/trimet/interfaces/types";
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

function getRouteArrivals(arrivalData: ArrivalData, nearbyStops: StopData) {
  const groupedArrivals = groupBy(arrivalData.arrival, "locid");
  console.log("groupedArrivals", groupedArrivals);

  const closestNearbyRoutes = [];
  const closestNearbyRouteStructure = [];

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

  return { closestNearbyRoutes, closestNearbyRouteStructure };
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
  const locationIds = join(
    map(nearbyStops?.location, loc => loc.locid),
    ","
  );

  useEffect(() => {
    async function fetchData() {
      const arrivals = await getArrivals(locationIds, 90);
      setArrivalData(arrivals);
    }
    fetchData();
  }, [locationIds.length > 0]);

  if (!nearbyStops) {
    return null;
  }

  const { closestNearbyRoutes, closestNearbyRouteStructure } = getRouteArrivals(
    arrivalData,
    nearbyStops
  );

  console.log("nearbyStops", nearbyStops);
  console.log("nearbyRoutes", nearbyRoutes);
  console.log("arrivals", arrivalData);
  console.log("closestNearbyRoutes", closestNearbyRoutes);
  console.log("closestNearbyRoutesStructure", closestNearbyRouteStructure);

  return (
    <div id="nearby-view-routes" className="scrollarea">
      <SearchRadiusSelection
        radiusSize={radiusSize}
        handleRadiusSelectionChange={handleRadiusSelectionChange}
      />
      <br />
      <NearbySubNav routeCount={routeCount} stopCount={stopCount} />
      {map(nearbyStops.location, (stop: StopLocation) => {
        return (
          <div>
            <div>{stop.locid}</div>
            {map(stop.route, route => {
              const arrivalsForLocation: Arrival[] = filter(
                arrivalData.arrival,
                arrival => {
                  return arrival.locid;
                }
              ) as Arrival[];

              const limitedArrivals = slice(arrivalsForLocation, 0, 2);
              const arrivals = map(limitedArrivals, arrival => {
                return (
                  <div>
                    {arrival.route}
                    {/*{arrival.estimated}*/}
                    {/*{arrival.scheduled}*/}
                  </div>
                );
              });

              return (
                <Card>
                  {route.desc}
                  {arrivals}
                </Card>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
