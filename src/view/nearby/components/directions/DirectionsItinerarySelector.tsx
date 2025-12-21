import React from "react";
import { Card, ListGroup, Form } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWalking } from "@fortawesome/free-solid-svg-icons";
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
      <Card.Header>Choose an Itinerary</Card.Header>
      <ListGroup>
        {allItineraries.map((itin, idx) => {
          const { startTime, endTime, duration, numberOfTransfers, walkingTime, transitTime } = getItineraryTimingInfo(itin);
          const label = `${startTime} - ${endTime} (${duration} min, ${numberOfTransfers} transfers)`;

          const isSelected = selectedItineraryIdx === idx;

          return (
            <ListGroup.Item
              key={idx}
              variant={isSelected ? "primary" : undefined}
              className="d-flex align-items-start gap-2"
              style={{ cursor: "pointer" }}
              onClick={() => onSelectItinerary(idx)}
            >
              <Form.Check
                type="radio"
                name="directions-itinerary"
                checked={isSelected}
                onChange={() => onSelectItinerary(idx)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-grow-1">
                <div><strong>{label}</strong></div>
                <div className="d-flex align-items-center">
                  <span className="me-2" aria-hidden="true"><FontAwesomeIcon icon={faWalking} /></span>
                  <span>Walk: {walkingTime} min</span>
                  <span className="ms-3 me-2" aria-hidden="true"><FontAwesome name="bus" /></span>
                  <span>Transit: {transitTime} min</span>
                </div>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}
