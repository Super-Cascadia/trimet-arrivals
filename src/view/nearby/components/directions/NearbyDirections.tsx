import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useOutletContext } from "react-router";
import { useSearchParams } from "react-router-dom";
import { TopNavBar } from "../common/TopNavBar";
import DirectionsItinerarySelector from "./DirectionsItinerarySelector";
import DirectionsStepsList from "./DirectionsStepsList";
import DirectionsRouteInfo from "./DirectionsRouteInfo";
import { NearbyViewComponentOutletContextProps } from "../../context/NearbyViewContext";
import { planTrip } from "../../../../api/trimet/tripplanner";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { getRouteByIdAndDirection as fetchRouteByIdAndDirection } from "../../../../api/trimet/routeConfig";
import { processRouteConfig } from "../../utils/routeConfigUtils";
import { extractAllItineraries, getLegsForItinerary } from "../../utils/tripPlannerUtils";

export default function NearbyDirections() {
  const [searchParams] = useSearchParams();
  const context = useOutletContext<NearbyViewComponentOutletContextProps>();

  const route = searchParams.get("route");
  const direction = searchParams.get("direction");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [dirDesc, setDirDesc] = useState<string>("");
  const [fromStop, setFromStop] = useState<ArrivalLocation | null>(null);
  const [toStop, setToStop] = useState<ArrivalLocation | null>(null);
  const [intermediateStops, setIntermediateStops] = useState<Array<{ locid: number; desc: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allItineraries, setAllItineraries] = useState<Array<any>>([]);
  const [selectedItineraryIdx, setSelectedItineraryIdx] = useState<number>(0);
  const [tripLegs, setTripLegs] = useState<Array<any>>([]);

  useEffect(() => {
    async function setupDirections() {
      if (!route || !direction || !from || !to) return;
      setIsLoading(true);
      context.clearAllMapLayers();

      try {
        // Fetch and process route config
        const data = await fetchRouteByIdAndDirection(parseInt(route, 10), parseInt(direction, 10));
        const configData = processRouteConfig(data, parseInt(direction, 10), parseInt(from, 10), parseInt(to, 10));
        
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

  return (
    <div className="scrollarea">
      <TopNavBar id="Directions" />
      {isLoading ? (
        <Card><Card.Body>Loading directions…</Card.Body></Card>
      ) : (
        <>
          <DirectionsRouteInfo
            route={route!}
            dirDesc={dirDesc}
            fromStop={fromStop}
            toStop={toStop}
          />

          <DirectionsItinerarySelector
            allItineraries={allItineraries}
            selectedItineraryIdx={selectedItineraryIdx}
            onSelectItinerary={handleSelectItinerary}
          />

          <Card>
            <Card.Header>Steps</Card.Header>
            <DirectionsStepsList
              legs={tripLegs}
              fromStop={fromStop}
              toStop={toStop}
              intermediateStops={intermediateStops}
            />
          </Card>
        </>
      )}
    </div>
  );
}
