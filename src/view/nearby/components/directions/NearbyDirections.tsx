import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useOutletContext } from "react-router";
import { useSearchParams } from "react-router-dom";
import { TopNavBar } from "../common/navigation/TopNavBar";
import DirectionsItinerarySelector from "./DirectionsItinerarySelector";
import DirectionsStepsList from "./DirectionsStepsList";
import DirectionsRouteInfo from "./DirectionsRouteInfo";
import { NearbyViewComponentOutletContextProps } from "../../context/NearbyViewContext";
import { Itineraries, Itinerary, planTrip, TripLeg } from "../../../../api/trimet/tripplanner";
import { getArrivals } from "../../../../api/trimet/arrivals";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import { getRouteByIdAndDirection as fetchRouteByIdAndDirection } from "../../../../api/trimet/routeConfig";
import { processRouteConfig } from "../../utils/routeConfigUtils";
import { extractAllItineraries, getLegsForItinerary } from "../../utils/tripPlannerUtils";

export default function NearbyDirections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const context = useOutletContext<NearbyViewComponentOutletContextProps>();

  const route = searchParams.get("route");
  const direction = searchParams.get("direction");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [dirDesc, setDirDesc] = useState<string>("");
  const [fromStop, setFromStop] = useState<ArrivalLocation | null>(null);
  const [toStop, setToStop] = useState<ArrivalLocation | null>(null);
  const [allStopsOnRoute, setAllStopsOnRoute] = useState<RouteDirectionStop[]>([]);
  const [intermediateStops, setIntermediateStops] = useState<Array<{ locid: number; desc: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allItineraries, setAllItineraries] = useState<Itinerary[]>([]);
  const [selectedItineraryIdx, setSelectedItineraryIdx] = useState<number>(0);
  const [tripLegs, setTripLegs] = useState<TripLeg[]>([]);

  useEffect(() => {
    async function setupDirections() {
      if (!from || !to) return;
      setIsLoading(true);
      context.clearAllMapLayers();

      try {
        if (route && direction) {
          // Fetch and process route config
          const data = await fetchRouteByIdAndDirection(parseInt(route, 10), parseInt(direction, 10));
          const configData = processRouteConfig(data, parseInt(direction, 10), parseInt(from, 10), parseInt(to, 10));
          
          // Extract all stops on the route for the selector
          const routeObj = data.route?.[0];
          const matchingDir = routeObj?.dir?.find(d => d.dir === parseInt(direction, 10));
          const stops = matchingDir?.stop || [];
          setAllStopsOnRoute(stops);
          
          setDirDesc(configData.dirDesc);
          setFromStop(configData.fromStop);
          setToStop(configData.toStop);
          setIntermediateStops(configData.intermediateStops);

          // Draw the route segment on the map
          if (configData.fromStop && configData.toStop) {
            context.handleRouteArrivalsOpened(
              route,
              direction,
              from,
              configData.fromStop,
              configData.toStop
            );
          }
        } else {
          // No route specified, fetch stop details for from/to
          try {
            const arrivalData = await getArrivals(`${from},${to}`, 1);
            if (arrivalData && arrivalData.location) {
              const fromLoc = arrivalData.location.find(l => l.id === parseInt(from, 10));
              const toLoc = arrivalData.location.find(l => l.id === parseInt(to, 10));
              if (fromLoc) setFromStop(fromLoc);
              if (toLoc) setToStop(toLoc);
            }
          } catch (e) {
            console.warn("Failed to fetch stop details", e);
          }
        }

        // Fetch Trip Planner
        try {
          const plan = await planTrip({ fromPlace: from, toPlace: to, arr: "D", min: "T" });
          const itins = extractAllItineraries(plan);
          setAllItineraries(itins);
          setSelectedItineraryIdx(0);
          
          if (itins.length > 0) {
            const legsForFirst = getLegsForItinerary(itins[0]);
            setTripLegs(legsForFirst);
          }
        } catch (e) {
          console.warn("Trip planner request failed", e);
          setTripLegs([]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    setupDirections();
  }, [route, direction, from, to]);

  const handleSelectItinerary = (idx: number) => {
    setSelectedItineraryIdx(idx);
    if (allItineraries[idx]) {
      const legsForSelected = getLegsForItinerary(allItineraries[idx]);
      setTripLegs(legsForSelected);
    }
  };

  const handleFromStopChange = (stopId: number, stopIndex: number) => {
    // Update URL params to trigger re-fetch with new from stop
    const newParams = new URLSearchParams(searchParams);
    newParams.set("from", stopId.toString());
    setSearchParams(newParams);
  };

  const handleToStopChange = (stopId: number, stopIndex: number) => {
    // Update URL params to trigger re-fetch with new to stop
    const newParams = new URLSearchParams(searchParams);
    newParams.set("to", stopId.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="scrollarea">
      <TopNavBar id="Directions" />
      {isLoading ? (
        <Card><Card.Body>Loading directions…</Card.Body></Card>
      ) : (
        <>
          <DirectionsRouteInfo
            route={route || undefined}
            dirDesc={dirDesc}
            fromStop={fromStop}
            toStop={toStop}
            allStopsOnRoute={allStopsOnRoute}
            onFromStopChange={handleFromStopChange}
            onToStopChange={handleToStopChange}
          />
          <br/>

          <DirectionsItinerarySelector
            allItineraries={allItineraries}
            selectedItineraryIdx={selectedItineraryIdx}
            onSelectItinerary={handleSelectItinerary}
          />

          <br/>

          <DirectionsStepsList
            fromStop={fromStop}
            legs={tripLegs}
            intermediateStops={intermediateStops}
            toStop={toStop}
          />
        </>
      )}
    </div>
  );
}
