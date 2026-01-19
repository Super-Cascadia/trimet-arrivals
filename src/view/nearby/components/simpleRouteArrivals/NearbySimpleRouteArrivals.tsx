import {
  findIndex,
  isEmpty,
  toNumber
} from "lodash";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { getArrivals } from "../../../../api/trimet/arrivals";
import {
  Arrival,
  ArrivalData,
  ArrivalLocation
} from "../../../../api/trimet/interfaces/arrivals";
import {
  RouteDataResultSet
} from "../../../../api/trimet/interfaces/routes";
import { getRouteByIdAndDirection } from "../../../../api/trimet/routeConfig";
import {
  filterArrivalsByRouteId,
  getDownstreamStopIds,
  getRouteStopInfo
} from "../../util/nearby-route-utils";
import { ArrivalList } from "../common/arrivals/NearbyStopArrivals";
import DeparturesCardSkeleton from "../common/cards/DeparturesCardSkeleton";
import { InfoCard } from "../common/cards/InfoCard";
import RouteStopInfo from "../common/stops/RouteStopInfo";
import RouteStopInfoSkeleton from "../common/stops/RouteStopInfoSkeleton";
import { StopsOnRoute } from "../common/stops/StopsOnRoute";
import StopsOnRouteSkeleton from "../common/stops/StopsOnRouteSkeleton";
import { TopNavBar } from "../common/navigation/TopNavBar";

/**
 * Component for displaying route arrivals and stops with destination selection.
 * 
 * Allows users to:
 * - View arrivals for a specific stop on a route
 * - Select a departure from the list of upcoming arrivals
 * - Choose a destination stop from remaining stops on the route
 * - View stops on the route with real-time arrival information
 * 
 * @param props - Component props
 * @param props.handleRouteArrivalsOpened - Callback function triggered when route arrivals are displayed or destination changes.
 *   Used to update map bounds to show the origin stop and optionally the destination stop.
 * 
 * URL Parameters (via React Router):
 * - id - Route ID
 * - stop - Stop location ID
 * - direction - Direction ID (0 or 1)
 * - destination - (optional) Destination stop location ID for pre-selecting a destination
 * 
 * @returns A route arrivals view with departure selection, destination selection, and navigation
 */
export default function NearbySimpleRouteArrivals({
  handleRouteArrivalsOpened
}: {
  handleRouteArrivalsOpened: (
    id: string,
    direction: string,
    stop: string,
    stopLocation: ArrivalLocation,
    destinationStopLocation?: ArrivalLocation
  ) => void;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const stop = searchParams.get("stop");
  const direction = searchParams.get("direction");
  const destinationParam = searchParams.get("destination");
  const [arrivalData, setArrivalData] = useState<ArrivalData | null>(null);
  const [filteredArrivalData, setFilteredArrivalData] = useState<Arrival[] | null>(
    null
  );
  const [routeStopsData, setRouteStopsData] = useState<RouteDataResultSet | null>(
    null
  );
  const [selectedDepartureIndex, setSelectedDepartureIndex] = useState<number>(0);
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<number | null>(null);
  const [downstreamArrivals, setDownstreamArrivals] = useState<ArrivalData | null>(null);
  const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState<boolean>(false);

  const fetchData = async () => {
    if (stop && id && direction) {
      console.log("Fetching data for stop: ", stop);
      const arrivals = await getArrivals(stop, 1000);
      setArrivalData(arrivals);

      const filteredArrivals = filterArrivalsByRouteId(arrivals.arrival, id);
      setFilteredArrivalData(filteredArrivals);

      const routeStops = await getRouteByIdAndDirection(
        toNumber(id),
        toNumber(direction)
      );
      setRouteStopsData(routeStops);
      const stopLocation: ArrivalLocation = arrivals.location[0];
      handleRouteArrivalsOpened(id, direction, stop, stopLocation);
      
      // Fetch arrivals for all downstream stops
      const routeStopsInDirection = routeStops?.route?.[0]?.dir?.[0]?.stop;
      const stopIds = getDownstreamStopIds(routeStopsInDirection, stop);
      
      if (stopIds) {
        const downstreamArrivalsData = await getArrivals(stopIds, 1000);
        setDownstreamArrivals(downstreamArrivalsData);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [stop]);

  // Update map bounds when destination selection changes
  useEffect(() => {
    // Don't update URL until we've initialized from URL params
    if (!hasInitializedFromUrl) {
      return;
    }
    
    if (selectedDestinationIndex !== null && remainingStopsOnRoute.length > 0 && arrivalData?.location?.[0] && downstreamArrivals) {
      const destinationStop = remainingStopsOnRoute[selectedDestinationIndex];
      const destinationLocation = downstreamArrivals.location?.find(loc => loc.id === destinationStop.locid);
      
      console.log('Destination selection changed:', {
        selectedDestinationIndex,
        destinationStop,
        destinationLocation,
        fromLocation: arrivalData.location[0]
      });
      
      if (destinationLocation && arrivalData?.location?.[0]) {
        handleRouteArrivalsOpened(id, direction, stop, arrivalData.location[0], destinationLocation);
      }
      
      // Update URL with destination parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.set('destination', destinationStop.locid.toString());
      setSearchParams(newParams, { replace: true });
    } else if (selectedDestinationIndex === null) {
      // Remove destination parameter when deselected
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('destination');
      setSearchParams(newParams, { replace: true });
    }
  }, [selectedDestinationIndex, downstreamArrivals, hasInitializedFromUrl]);

  const handleRefresh = () => {
    setArrivalData(null);
    setFilteredArrivalData(null);
    setRouteStopsData(null);
    setDownstreamArrivals(null);
    fetchData();
  };

  const isLoading = isEmpty(filteredArrivalData) || isEmpty(routeStopsData);

  const {
    stopLocation,
    shortSign,
    routeDesc,
    directionDesc,
    routeStopsInDirection,
    stopIndex,
    remainingStopsOnRoute,
    selectedArrival,
    currentStopSeq
  } = getRouteStopInfo(
    arrivalData,
    filteredArrivalData,
    routeStopsData,
    stop,
    selectedDepartureIndex
  );
  
  // Get destination stop info
  const destinationStop = selectedDestinationIndex !== null && remainingStopsOnRoute.length > 0
    ? remainingStopsOnRoute[selectedDestinationIndex]
    : null;
  
  const destinationLocation = destinationStop && downstreamArrivals?.location
    ? downstreamArrivals.location.find(loc => loc.id === destinationStop.locid)
    : null;
  
  // Set destination index from URL param when data is loaded
  useEffect(() => {
    if (destinationParam && remainingStopsOnRoute.length > 0 && !hasInitializedFromUrl) {
      const destinationStopId = toNumber(destinationParam);
      const index = findIndex(remainingStopsOnRoute, (stop) => stop.locid === destinationStopId);
      if (index >= 0) {
        setSelectedDestinationIndex(index);
        setHasInitializedFromUrl(true);
      }
    } else if (!destinationParam && remainingStopsOnRoute.length > 0 && !hasInitializedFromUrl) {
      // No destination in URL, mark as initialized
      setHasInitializedFromUrl(true);
    }
  }, [destinationParam, remainingStopsOnRoute, hasInitializedFromUrl]);

  return (
    <div className="route-arrivals-container">
      <TopNavBar 
        id={id} 
        shortSign={shortSign} 
        handleRefresh={handleRefresh}
        routeId={toNumber(id)}
        direction={toNumber(direction)}
        stopId={toNumber(stop)}
        routeDesc={routeDesc}
        stopDesc={stopLocation?.desc}
        directionDesc={directionDesc}
        stopLat={stopLocation?.lat}
        stopLng={stopLocation?.lng}
        destinationStopId={destinationStop?.locid}
        destinationStopDesc={destinationLocation?.desc}
      />
      <div className="scrollarea route-arrivals-scroll">
        {isLoading ? (
          <RouteStopInfoSkeleton />
        ) : (
          <RouteStopInfo 
            shortSign={shortSign} 
            stopLocation={stopLocation}
            routeId={toNumber(id)}
            direction={toNumber(direction)}
            routeDesc={routeDesc}
            directionDesc={directionDesc}
            allStopsOnRoute={routeStopsInDirection}
            currentStopIndex={stopIndex}
            destinationStopId={destinationStop?.locid}
            destinationStopDesc={destinationLocation?.desc}
            onDepartureStopSelect={(stopId: number) => {
              const newUrl = `/nearby/simple-routes/${id}?stop=${stopId}&direction=${direction}`;
              navigate(newUrl);
            }}
          />
        )}
        <br />
        {isLoading ? (
          <DeparturesCardSkeleton />
        ) : (
          <ArrivalList 
            arrivals={filteredArrivalData} 
            selectedIndex={selectedDepartureIndex}
            onSelectDeparture={setSelectedDepartureIndex}
          />
        )}
        <br />
        {isLoading ? (
          <StopsOnRouteSkeleton />
        ) : (
          <StopsOnRoute 
            remainingStopsOnRoute={remainingStopsOnRoute} 
            selectedArrival={selectedArrival} 
            currentStopSeq={currentStopSeq}
            allStopsOnRoute={routeStopsInDirection}
            downstreamArrivals={downstreamArrivals}
            onDestinationSelect={setSelectedDestinationIndex}
            selectedDestinationIndex={selectedDestinationIndex}
          />
        )}
        <br />
      </div>
      {!isLoading && (
        <div className="route-arrivals-go-button">
          <Button
            variant="primary"
            size="lg"
            className="w-100"
            disabled={selectedDestinationIndex === null}
            onClick={() => {
              if (selectedDestinationIndex !== null) {
                const destinationStop = remainingStopsOnRoute[selectedDestinationIndex];
                const url = `/nearby/directions?route=${id}&direction=${direction}&from=${stop}&to=${destinationStop.locid}`;
                window.location.href = url;
              }
            }}
          >
            GO
          </Button>
        </div>
      )}
    </div>
  );
}
