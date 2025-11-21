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
import DeparturesCardSkeleton from "./common/DeparturesCardSkeleton";
import { InfoCard } from "./common/InfoCard";
import RouteStopInfo from "./common/RouteStopInfo";
import RouteStopInfoSkeleton from "./common/RouteStopInfoSkeleton";
import { StopsOnRoute } from "./common/StopsOnRoute";
import StopsOnRouteSkeleton from "./common/StopsOnRouteSkeleton";
import { TopNavBar } from "./common/TopNavBar";
import "./NearbyRoutes.scss";

export default function NearbySimpleRouteArrivals({
  handleRouteArrivalsOpened
}: {
  handleRouteArrivalsOpened: (
    id: string,
    direction: string,
    stop: string,
    stopLocation: ArrivalLocation
  ) => void;
}) {
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

  const fetchData = async () => {
    if (stop) {
      console.log("Fetching data for stop: ", stop);
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
      const stopLocation: ArrivalLocation = arrivals.location[0];
      handleRouteArrivalsOpened(id, direction, stop, stopLocation);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stop]);

  const handleRefresh = () => {
    setArrivalData(null);
    setFilteredArrivalData(null);
    setRouteStopsData(null);
    fetchData();
  };

  const isLoading = isEmpty(filteredArrivalData) || isEmpty(routeStopsData);

  const stopLocation: ArrivalLocation = arrivalData?.location?.[0];
  const shortSign = filteredArrivalData?.[0] ? last(split(filteredArrivalData[0].shortSign, "To")) : null;
  const routeStopsInDirection = routeStopsData?.route?.[0]?.dir?.[0]?.stop;
  const stopIndex = routeStopsInDirection ? findIndex(
    routeStopsInDirection,
    (routeDirectionStop: RouteDirectionStop, index) => {
      return routeDirectionStop.locid === toNumber(stop);
    }
  ) : -1;

  const remainingStopsOnRoute = routeStopsInDirection && stopIndex >= 0 ? slice(routeStopsInDirection, stopIndex + 1) : [];

  const selectedArrival = filteredArrivalData && filteredArrivalData.length > 0 ? filteredArrivalData[0] : null;
  const currentStop = stopIndex >= 0 && routeStopsInDirection ? routeStopsInDirection[stopIndex] : null;
  const currentStopSeq = currentStop ? currentStop.seq : undefined;

  return (
    <div className="scrollarea">
      <TopNavBar id={id} shortSign={shortSign} handleRefresh={handleRefresh} />
      <br />
      {isLoading ? (
        <RouteStopInfoSkeleton />
      ) : (
        <RouteStopInfo shortSign={shortSign} stopLocation={stopLocation} />
      )}
      <br />
      {isLoading ? (
        <DeparturesCardSkeleton />
      ) : (
        <DeparturesCard filteredArrivals={filteredArrivalData} />
      )}
      <br />
      {isLoading ? (
        <StopsOnRouteSkeleton />
      ) : (
        <StopsOnRoute remainingStopsOnRoute={remainingStopsOnRoute} selectedArrival={selectedArrival} currentStopSeq={currentStopSeq} />
      )}
      <br />
      <InfoCard id={id} />
    </div>
  );
}
