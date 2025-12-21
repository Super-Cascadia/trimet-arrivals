import React from "react";
import { Card, Stack } from "react-bootstrap";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import { RouteStopSelector } from "../common/stops/RouteStopSelector";

interface DirectionsRouteInfoProps {
  route?: string;
  dirDesc?: string;
  fromStop: ArrivalLocation | null;
  toStop: ArrivalLocation | null;
  allStopsOnRoute?: RouteDirectionStop[];
  onFromStopChange?: (stopId: number, stopIndex: number) => void;
  onToStopChange?: (stopId: number, stopIndex: number) => void;
}

export default function DirectionsRouteInfo({ 
  route, 
  dirDesc, 
  fromStop, 
  toStop,
  allStopsOnRoute = [],
  onFromStopChange,
  onToStopChange
}: DirectionsRouteInfoProps) {
  // Find the current indices of from and to stops in the allStopsOnRoute array
  const fromStopIndex = allStopsOnRoute.findIndex(s => s.locid === fromStop?.id) ?? -1;
  const toStopIndex = allStopsOnRoute.findIndex(s => s.locid === toStop?.id) ?? -1;

  // Convert ArrivalLocation to RouteDirectionStop format for the selector
  const fromStopAsRouteStop: RouteDirectionStop | null = fromStop ? {
    locid: fromStop.id,
    desc: fromStop.desc,
    lat: fromStop.lat,
    lng: fromStop.lng,
    dir: fromStop.dir,
    seq: fromStopIndex,
    tp: false
  } : null;

  const toStopAsRouteStop: RouteDirectionStop | null = toStop ? {
    locid: toStop.id,
    desc: toStop.desc,
    lat: toStop.lat,
    lng: toStop.lng,
    dir: toStop.dir,
    seq: toStopIndex,
    tp: false
  } : null;

  return (
    <>
      {route && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Route {route} — {dirDesc}</Card.Title>
          </Card.Body>
        </Card>
      )}

      <Stack gap={3}>
        {fromStopAsRouteStop && (
          <RouteStopSelector
            headerTitle="From"
            selectedStop={fromStopAsRouteStop}
            allStopsOnRoute={allStopsOnRoute}
            currentStopIndex={fromStopIndex}
            onStopSelect={onFromStopChange}
          />
        )}

        {toStopAsRouteStop && (
          <RouteStopSelector
            headerTitle="To"
            selectedStop={toStopAsRouteStop}
            allStopsOnRoute={allStopsOnRoute}
            currentStopIndex={toStopIndex}
            onStopSelect={onToStopChange}
          />
        )}
      </Stack>
    </>
  );
}
