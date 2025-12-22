import React from "react";
import { Card, ListGroup, Form } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWalking, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getItineraryTimingInfo, getLegsForItinerary } from "../../utils/tripPlannerUtils";
import RouteIndicator from "../../../../component/route/RouteIndicator";

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

          const legs = getLegsForItinerary(itin);
          // Build ordered leg summary: transit routes and walk icons
          const legSummaryNodes = legs
            .map((l, i) => {
              const mode = (l["@_mode"] || "").toString().toUpperCase();
              const mins = l["time-distance"]?.duration;
              if (mode === "WALK") {
                return (
                  <span key={`walk-${i}`} className="d-inline-flex align-items-center text-muted" aria-label="Walk segment">
                    <FontAwesomeIcon icon={faWalking} />
                    {mins != null && <small className="ms-1">{mins} min</small>}
                  </span>
                );
              }
              const num = l.route?.number;
              const rid = typeof num === "string" ? parseInt(num, 10) : num;
              if (rid && Number.isFinite(rid)) {
                return (
                  <span key={`route-${rid}-${i}`} className="d-inline-flex align-items-center" aria-label={`Transit segment ${rid}`}>
                    <RouteIndicator routeId={rid as number} />
                    {mins != null && <small className="ms-1 text-muted">{mins} min</small>}
                  </span>
                );
              }
              return null;
            })
            .filter(Boolean) as React.ReactNode[];

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
                  <span>{walkingTime} min</span>
                  <span className="ms-3 me-2" aria-hidden="true"><FontAwesome name="bus" /></span>
                  <span>{transitTime} min</span>
                </div>
                {legSummaryNodes.length > 0 && (
                  <div className="d-flex flex-wrap align-items-center gap-2 mt-2" aria-label="Itinerary leg summary">
                    {legSummaryNodes.map((node, i) => (
                      <React.Fragment key={`legfrag-${i}`}>
                        {node}
                        {i < legSummaryNodes.length - 1 && (
                          <span className="mx-1 text-muted" aria-hidden="true">
                            <FontAwesomeIcon icon={faArrowRight} size="xs" />
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
}
