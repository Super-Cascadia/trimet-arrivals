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
import { Button } from "react-bootstrap";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
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
  const [arrivalData, setArrivalData] = useState<ArrivalData>(null);
  const [filteredArrivalData, setFilteredArrivalData] = useState<Arrival[]>(
    null
  );
  const [routeStopsData, setRouteStopsData] = useState<RouteDataResultSet>(
    null
  );
  const [selectedDepartureIndex, setSelectedDepartureIndex] = useState<number>(0);
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<number | null>(null);
  const [downstreamArrivals, setDownstreamArrivals] = useState<ArrivalData>(null);
  const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState<boolean>(false);

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
      
      // Fetch arrivals for all downstream stops
      const routeStopsInDirection = routeStops?.route?.[0]?.dir?.[0]?.stop;
      if (routeStopsInDirection) {
        const stopIndex = findIndex(
          routeStopsInDirection,
          (routeDirectionStop: RouteDirectionStop) => {
            return routeDirectionStop.locid === toNumber(stop);
          }
        );
        
        if (stopIndex >= 0) {
          const remainingStops = slice(routeStopsInDirection, stopIndex + 1);
          // Get up to 128 stop IDs (API limit)
          const stopIds = remainingStops.slice(0, 128).map(s => s.locid).join(',');
          
          if (stopIds) {
            const downstreamArrivalsData = await getArrivals(stopIds, 1000);
            setDownstreamArrivals(downstreamArrivalsData);
          }
        }
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

  const stopLocation: ArrivalLocation = arrivalData?.location?.[0];
  const shortSign = filteredArrivalData?.[0] ? last(split(filteredArrivalData[0].shortSign, "To")) : null;
  const routeDesc = routeStopsData?.route?.[0]?.desc;
  const directionDesc = routeStopsData?.route?.[0]?.dir?.[0]?.desc;
  const routeStopsInDirection = routeStopsData?.route?.[0]?.dir?.[0]?.stop;
  const stopIndex = routeStopsInDirection ? findIndex(
    routeStopsInDirection,
    (routeDirectionStop: RouteDirectionStop, index) => {
      return routeDirectionStop.locid === toNumber(stop);
    }
  ) : -1;

  const remainingStopsOnRoute = routeStopsInDirection && stopIndex >= 0 ? slice(routeStopsInDirection, stopIndex + 1) : [];

  const selectedArrival = filteredArrivalData && filteredArrivalData.length > selectedDepartureIndex ? filteredArrivalData[selectedDepartureIndex] : null;
  const currentStop = stopIndex >= 0 && routeStopsInDirection ? routeStopsInDirection[stopIndex] : null;
  const currentStopSeq = currentStop ? currentStop.seq : undefined;
  
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
            onDepartureStopSelect={(stopId) => {
              const newUrl = `/nearby/simple-routes/${id}?stop=${stopId}&direction=${direction}`;
              navigate(newUrl);
            }}
          />
        )}
        <br />
        {isLoading ? (
          <DeparturesCardSkeleton />
        ) : (
          <DeparturesCard 
            filteredArrivals={filteredArrivalData} 
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
