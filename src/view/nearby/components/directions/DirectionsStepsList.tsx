import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { ArrivalLocation } from "../../../../api/trimet/interfaces/arrivals";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import DirectionsStepItem from "./DirectionsStepItem";
import DirectionsFallbackSteps from "./DirectionsFallbackSteps";
import { TripLeg } from "../../../../api/trimet/tripplanner";

interface LegRenderData {
  mode: string;
  label: string;
  fromName: string;
  toName: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  distance?: number;
  routeNumber?: string;
  isTransit: boolean;
}

interface DirectionsStepsListProps {
  legs: TripLeg[];
  fromStop: ArrivalLocation | null;
  toStop: ArrivalLocation | null;
  intermediateStops: Array<{ locid: number; desc: string }>;
}


export default function DirectionsStepsList({
  legs,
  intermediateStops,
  fromStop,
  toStop,
}: DirectionsStepsListProps) {
  if (legs && legs.length > 0) {
    return (
      <Card>
        <Card.Header>Steps</Card.Header>
        <ListGroup>
          {legs.map((leg, idx) => (
            <DirectionsStepItem key={idx} idx={idx} leg={leg} />
          ))}
        </ListGroup>
      </Card>
    );
  }

  // Fallback to route config steps
  return (
    <DirectionsFallbackSteps fromStop={fromStop} toStop={toStop} intermediateStops={intermediateStops} />
  );
}
