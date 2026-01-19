import React from "react";
import { Card, Stack, Form } from "react-bootstrap";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import StopSelect from "../../../home/components/StopSelect";
import { StopOption, useTrimetStops } from "../../../home/hooks/useTrimetStops";
import "./DirectionsRouteInfo.scss";

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
  // Fetch all available stops (already grouped by quadrant)
  const { stopOptions: groupedStops, isLoading } = useTrimetStops();

  // Find the current indices of from and to stops in the allStopsOnRoute array
  const fromStopIndex = allStopsOnRoute.findIndex(s => s.locid === fromStop?.id) ?? -1;
  const toStopIndex = allStopsOnRoute.findIndex(s => s.locid === toStop?.id) ?? -1;

  // Convert RouteDirectionStop objects to StopOption format and group by quadrant
  const routeStopsByQuadrant: { [key: string]: StopOption[] } = {
    NE: [],
    NW: [],
    SE: [],
    SW: []
  };

  const DEFAULT_CENTER_LAT = 45.5152;
  const DEFAULT_CENTER_LNG = -122.6784;

  const getQuadrant = (lat: number, lng: number): string => {
    const isNorth = lat >= DEFAULT_CENTER_LAT;
    const isEast = lng >= DEFAULT_CENTER_LNG;
    
    if (isNorth && isEast) return "NE";
    if (isNorth && !isEast) return "NW";
    if (!isNorth && isEast) return "SE";
    return "SW";
  };

  allStopsOnRoute.forEach((stop) => {
    // Validate coordinates exist
    if (typeof stop.lat !== 'number' || typeof stop.lng !== 'number') {
      console.warn('Invalid coordinates for stop:', stop);
      return;
    }
    
    const quadrant = getQuadrant(stop.lat, stop.lng);
    routeStopsByQuadrant[quadrant].push({
      value: stop.locid?.toString() || "",
      label: `${stop.desc} (${stop.locid || 'Unknown ID'})`,
      stopData: stop as any,
    });
  });

  // Convert to grouped format with explicit ordering
  const quadrantOrder = ['NE', 'NW', 'SE', 'SW'];
  const routeStopsGrouped = quadrantOrder
    .filter(key => routeStopsByQuadrant[key].length > 0)
    .map(key => ({
      label: key,
      options: routeStopsByQuadrant[key]
    }));

  // Use route-specific grouped stops if available, otherwise use all grouped stops
  const selectOptions = routeStopsGrouped.length > 0 ? routeStopsGrouped : groupedStops;

  // Convert current from/to stops to StopOption format
  const fromStopOption: StopOption | null = fromStop
    ? {
        value: fromStop.id?.toString() || "",
        label: `${fromStop.desc} (${fromStop.id || 'Unknown ID'})`,
        stopData: fromStop as any,
      }
    : null;

  const toStopOption: StopOption | null = toStop
    ? {
        value: toStop.id?.toString() || "",
        label: `${toStop.desc} (${toStop.id || 'Unknown ID'})`,
        stopData: toStop as any,
      }
    : null;

  const handleFromStopChange = (option: StopOption | null) => {
    if (option && onFromStopChange) {
      const selectedStop = allStopsOnRoute.find(s => s.locid?.toString() === option.value);
      if (selectedStop) {
        const index = allStopsOnRoute.indexOf(selectedStop);
        onFromStopChange(selectedStop.locid || 0, index);
      }
    }
  };

  const handleToStopChange = (option: StopOption | null) => {
    if (option && onToStopChange) {
      const selectedStop = allStopsOnRoute.find(s => s.locid?.toString() === option.value);
      if (selectedStop) {
        const index = allStopsOnRoute.indexOf(selectedStop);
        onToStopChange(selectedStop.locid || 0, index);
      }
    }
  };

  return (
    <div className="directions-route-info">
      {route && (
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Route {route} — {dirDesc}</Card.Title>
          </Card.Body>
        </Card>
      )}

      <Stack gap={3}>
        {fromStopOption && (
          <StopSelect
            label="From"
            value={fromStopOption}
            onChange={handleFromStopChange}
            options={selectOptions}
            isLoading={isLoading}
          />
        )}

        {toStopOption && (
          <StopSelect
            label="To"
            value={toStopOption}
            onChange={handleToStopChange}
            options={selectOptions}
            isLoading={isLoading}
          />
        )}
      </Stack>
    </div>
  );
}
