import { map } from "lodash";
import moment from "moment";
import React from "react";
import { Card, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { Arrival } from "../../../../api/trimet/interfaces/arrivals";
import { ArrivalCountdown } from "./ArrivalCountdown";
import { ExpandCollapseListItem } from "./ExpandCollapseListItem";
import { StatusIndicator } from "./StatusIndicator";
import "./DeparturesCard.scss";

interface DeparturesCardParams {
  filteredArrivals: Arrival[];
  selectedIndex?: number;
  onSelectDeparture?: (index: number) => void;
}

export function DeparturesCard({ filteredArrivals, selectedIndex = 0, onSelectDeparture }: DeparturesCardParams) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleDepartureSelect = (index: number) => {
    if (onSelectDeparture) {
      onSelectDeparture(index);
      setIsExpanded(false);
    }
  };
  
  const arrivalsToShow = isExpanded ? filteredArrivals : [filteredArrivals[selectedIndex]];
  const hasMoreArrivals = filteredArrivals.length > 1;
  const hasEarlierDepartures = selectedIndex > 0 && !isExpanded;

  return (
    <Card>
      <Card.Header>Departures</Card.Header>
      <ListGroup className="list-group-flush">
        {hasEarlierDepartures && (
          <ExpandCollapseListItem onClick={() => setIsExpanded(true)} icon="chevron-up">
            {selectedIndex} earlier departure{selectedIndex === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        {map(arrivalsToShow, (arrival: any, arrivalIndex: number) => {
          const actualIndex = isExpanded ? arrivalIndex : selectedIndex;
          const estimatedArrivalTime = arrival.estimated;
          const scheduledArrivalTime = arrival.scheduled;

          const variant = actualIndex === 0 ? "primary" : "light";
          const estimatedTime = moment(estimatedArrivalTime).format("h:mm a");
          const scheduledTime = moment(scheduledArrivalTime).format("h:mm a");
          const arrivalTime = estimatedArrivalTime
            ? estimatedTime
            : scheduledTime;

          return (
            <ListGroup.Item
              key={actualIndex}
              variant={variant}
              as="li"
              className="d-flex justify-content-between align-items-start"
              onClick={() => handleDepartureSelect(actualIndex)}
              style={{ cursor: onSelectDeparture ? 'pointer' : 'default' }}
            >
              <div className="d-flex align-items-center gap-2">
                {onSelectDeparture && (
                  <input
                    type="radio"
                    name="departure-selection"
                    checked={selectedIndex === actualIndex}
                    onChange={() => handleDepartureSelect(actualIndex)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                <div>
                  {arrival.vehicleID ? (
                    <span className="bus-id">Bus {arrival.vehicleID}</span>
                  ) : (
                    <span>Departure {actualIndex + 1}</span>
                  )}
                </div>
              </div>
              <div style={{ fontFamily: "'Courier New', 'Consolas', 'Monaco', monospace", fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                <span className="fw-bold" style={{ fontSize: '0.85rem' }}>
                  <ArrivalCountdown
                    estimatedArrivalTime={estimatedArrivalTime}
                    scheduledArrivalTime={scheduledArrivalTime}
                  />
                  {arrivalTime && <span className="text-muted"> ({arrivalTime})</span>}
                  <StatusIndicator estimated={estimatedArrivalTime} scheduled={scheduledArrivalTime} />
                </span>
              </div>
            </ListGroup.Item>
          );
        })}
        {hasMoreArrivals && (
          <ExpandCollapseListItem 
            onClick={() => setIsExpanded(!isExpanded)} 
            icon={isExpanded ? "chevron-up" : "chevron-down"}
          >
            {isExpanded 
              ? "Show Less" 
              : `${filteredArrivals.length - 1} future departure${filteredArrivals.length - 1 === 1 ? '' : 's'}`
            }
          </ExpandCollapseListItem>
        )}
      </ListGroup>
    </Card>
  );
}