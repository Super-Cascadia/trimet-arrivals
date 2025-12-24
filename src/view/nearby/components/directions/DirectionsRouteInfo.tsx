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
  // Fetch all available stops
  const { stopOptions: allAvailableStops, isLoading } = useTrimetStops();

  // Flatten grouped stop options to create a complete list
  const flattenedStops: StopOption[] = [];
  allAvailableStops.forEach((group: any) => {
    if (group.options) {
      flattenedStops.push(...group.options);
    }
  });

  // Find the current indices of from and to stops in the allStopsOnRoute array
  const fromStopIndex = allStopsOnRoute.findIndex(s => s.locid === fromStop?.id) ?? -1;
  const toStopIndex = allStopsOnRoute.findIndex(s => s.locid === toStop?.id) ?? -1;

  // Convert RouteDirectionStop objects to StopOption format for StopSelect
  const stopOptions: StopOption[] = allStopsOnRoute.map((stop) => ({
    value: stop.locid?.toString() || "",
    label: `${stop.desc} (${stop.locid || 'Unknown ID'})`,
    stopData: stop as any,
  }));

  // Use flattened stops if route-specific stops aren't available
  const selectOptions = stopOptions.length > 0 ? stopOptions : flattenedStops;

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
