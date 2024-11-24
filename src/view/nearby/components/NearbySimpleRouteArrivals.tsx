import {
  filter,
  findIndex,
  isEmpty,
  last,
  slice,
  split,
  toNumber
} from "lodash";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { getArrivals } from "../../../api/trimet/arrivals";
import {
  Arrival,
  ArrivalData,
  ArrivalLocation
} from "../../../api/trimet/interfaces/arrivals";
import {
  RouteDataResultSet,
  RouteDirectionStop
} from "../../../api/trimet/interfaces/routes";
import { getRouteByIdAndDirection } from "../../../api/trimet/routeConfig";
import { DeparturesCard } from "./common/DeparturesCard";
import { InfoCard } from "./common/InfoCard";
import RouteStopInfo from "./common/RouteStopInfo";
import { StopsOnRoute } from "./common/StopsOnRoute";
import { TopNavBar } from "./common/TopNavBar";
import "./NearbyRoutes.scss";

export default function NearbySimpleRouteArrivals({ handleRouteArrivalsOpened}: { handleRouteArrivalsOpened: (id: string, direction: string) => void }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const stop = searchParams.get("stop");
  const direction = searchParams.get("direction");
  const [arrivalData, setArrivalData] = useState<ArrivalData>(null);
  const [filteredArrivalData, setFilteredArrivalData] = useState<Arrival[]>(
    null
  );
  const [routeStopsData, setRouteStopsData] = useState<RouteDataResultSet>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      if (stop) {
        const arrivals = await getArrivals(stop, 1000);
        setArrivalData(arrivals);

        const filteredArrivals: Arrival[] = filter(
          arrivals.arrival,
          (arrival: Arrival) => {
            return arrival.route === toNumber(id);
          }
        );

        setFilteredArrivalData(filteredArrivals);

        const routeStops = await getRouteByIdAndDirection(
          toNumber(id),
          toNumber(direction)
        );
        setRouteStopsData(routeStops);
        handleRouteArrivalsOpened(id, direction);
      }
    }

    fetchData();
  }, [stop]);

  if (isEmpty(filteredArrivalData) || isEmpty(routeStopsData)) {
    return null;
  }

  const stopLocation: ArrivalLocation = arrivalData.location[0];
  const shortSign = last(split(filteredArrivalData[0].shortSign, "To"));
  const routeStopsInDirection = routeStopsData.route[0].dir[0].stop;
  const stopIndex = findIndex(
    routeStopsInDirection,
    (routeDirectionStop: RouteDirectionStop, index) => {
      return routeDirectionStop.locid === toNumber(stop);
    }
  );

  const remainingStopsOnRoute = slice(routeStopsInDirection, stopIndex + 1);

  return (
    <div className="scrollarea">
      <TopNavBar id={id} />
      <br />
      <RouteStopInfo shortSign={shortSign} stopLocation={stopLocation} />
      <br />
      <DeparturesCard filteredArrivals={filteredArrivalData} />
      <br />
      <StopsOnRoute remainingStopsOnRoute={remainingStopsOnRoute} />
      <br />
      <InfoCard id={id} />
    </div>
  );
}
