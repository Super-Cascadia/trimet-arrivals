import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { getItineraryTimingInfo } from "../../utils/tripPlannerUtils";

interface DirectionsItinerarySelectorProps {
  allItineraries: Array<any>;
  selectedItineraryIdx: number;
  onSelectItinerary: (idx: number) => void;
}

export default function DirectionsItinerarySelector({
  allItineraries,
  selectedItineraryIdx,
  onSelectItinerary
}: DirectionsItinerarySelectorProps) {
  if (allItineraries.length <= 1) {
    return null;
  }

  return (
    <Card>
      <Card.Header>Choose a Route</Card.Header>
      <ListGroup>
        {allItineraries.map((itin, idx) => {
          const { startTime, endTime, duration, numberOfTransfers, walkingTime, transitTime } = getItineraryTimingInfo(itin);
          const label = `${startTime} - ${endTime} (${duration} min, ${numberOfTransfers} transfers)`;

          return (
            <ListGroup.Item
              key={idx}
              style={{
                cursor: "pointer",
                backgroundColor: selectedItineraryIdx === idx ? "#e7f3ff" : "transparent"
              }}
              onClick={() => onSelectItinerary(idx)}
            >
              <div><strong>{label}</strong></div>
              <div>Walk: {walkingTime} min | Transit: {transitTime} min</div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}
