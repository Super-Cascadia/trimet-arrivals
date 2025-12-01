import { groupBy, map, sortBy } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { Button, ButtonGroup, Card, ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import { Arrival, ArrivalData } from "../../../api/trimet/interfaces/arrivals";
import { getFormattedTime } from "../util/timeUtils";
import ArrivalListItem from "./common/ArrivalListItem";
import { ArrivalTimestamp } from "./common/ArrivalTimestamp";
import { ExpandCollapseListItem } from "./common/ExpandCollapseListItem";

function sortArrivalsByEstimated(arrivals: Arrival[]): Arrival[] {
  return sortBy(arrivals, arrival =>
    moment(arrival.scheduled)
      .utc()
      .valueOf()
  );
}

interface ArrivalsTableParams {
  data?: ArrivalData;
  arrivals?: Arrival[];
  selectedIndex?: number;
  onSelectDeparture?: (index: number) => void;
}

function getArrivalsList(
  allArrivals: Arrival[], 
  displayArrivals: Arrival[], 
  selectedIndex?: number, 
  onSelectDeparture?: (index: number) => void
) {
  const { id } = useParams();

  return map(displayArrivals, (arrival: Arrival) => {
    // Find the original index in the full list
    const originalIndex = allArrivals.indexOf(arrival);
    
    return (
      <ArrivalListItem 
        key={arrival.id} 
        id={id} 
        arrival={arrival} 
        isSelected={selectedIndex === originalIndex}
        onSelect={onSelectDeparture ? () => onSelectDeparture(originalIndex) : undefined}
      />
    );
  });
}

/**
 * Displays a list of transit arrivals/departures with optional expand/collapse functionality.
 * 
 * @param data - The arrival data object containing an array of arrivals
 * @param arrivals - Optional pre-sorted array of arrivals to display instead of data.arrival
 * @param selectedIndex - Index of the currently selected arrival (default: 0)
 * @param onSelectDeparture - Optional callback function to handle departure selection. When provided, enables selection mode with expand/collapse UI
 * @returns A card component containing the list of arrivals with expand/collapse controls when in selection mode
 */
export function ArrivalList({ data, arrivals, selectedIndex = 0, onSelectDeparture }: ArrivalsTableParams) {
  const sortedArrivals = arrivals || (data ? sortArrivalsByEstimated(data.arrival) : []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'flat' | 'grouped'>('grouped');
  const navigate = useNavigate();
  
  const isSelectionMode = !!onSelectDeparture;
  
  let displayArrivals = sortedArrivals;
  let hasEarlier = false;
  let hasLater = false;
  
  if (isSelectionMode && viewMode === 'flat') {
    if (!isExpanded) {
      if (sortedArrivals[selectedIndex]) {
        displayArrivals = [sortedArrivals[selectedIndex]];
      } else {
        displayArrivals = [];
      }
      hasEarlier = selectedIndex > 0;
      hasLater = selectedIndex < sortedArrivals.length - 1;
    } else {
      displayArrivals = sortedArrivals;
    }
  }
  
  const renderFlatList = () => {
    const arrivalsList = getArrivalsList(sortedArrivals, displayArrivals, selectedIndex, onSelectDeparture);
    return (
      <ListGroup variant="flush" as="ul">
        {hasEarlier && (
          <ExpandCollapseListItem onClick={() => setIsExpanded(true)} icon="chevron-up">
            {selectedIndex} earlier departure{selectedIndex === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        
        {arrivalsList}
        
        {hasLater && (
          <ExpandCollapseListItem onClick={() => setIsExpanded(true)} icon="chevron-down">
            {sortedArrivals.length - 1 - selectedIndex} future departure{sortedArrivals.length - 1 - selectedIndex === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        
        {isExpanded && isSelectionMode && (
          <ExpandCollapseListItem onClick={() => setIsExpanded(false)} icon="chevron-up">
            Show Less
          </ExpandCollapseListItem>
        )}
      </ListGroup>
    );
  };

  const renderGroupedList = () => {
    const grouped = groupBy(sortedArrivals, 'route');
    const routes = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));
    
    return (
      <ListGroup variant="flush" as="ul">
        {routes.map(routeId => {
          const routeArrivals = grouped[routeId];
          const firstArrival = routeArrivals[0];
          
          return (
            <ListGroup.Item 
              key={routeId} 
              variant="light" 
              className="d-flex justify-content-between align-items-start"
              onClick={() => {
                if (!onSelectDeparture) {
                  const url = `/nearby/simple-routes/${firstArrival.route}?stop=${firstArrival.locid}&direction=${firstArrival.dir}`;
                  navigate(url);
                }
              }}
              style={{ cursor: !onSelectDeparture ? "pointer" : "default" }}
            >
              <div className="me-1">
                <span className="fw-bold h2">
                  {routeId}
                </span>
                <div className="text-muted">
                  {firstArrival.shortSign}
                </div>
              </div>
              
              <div className="mt-1" style={{ fontSize: '0.75em' }}>
                {routeArrivals.map((arrival, idx) => (
                  <div key={arrival.id} className={idx > 0 ? "text-muted" : ""}>
                    <ArrivalTimestamp 
                      estimatedArrivalTime={arrival.estimated} 
                      scheduledArrivalTime={arrival.scheduled} 
                    />
                  </div>
                ))}
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  };

  return (
    <Card className="arrival-list">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Departures</span>
        <ButtonGroup size="sm">
          <Button 
            variant={viewMode === 'grouped' ? 'primary' : 'outline-primary'} 
            onClick={() => { setViewMode('grouped'); setIsExpanded(true); }}
          >
            Route
          </Button>
          <Button 
            variant={viewMode === 'flat' ? 'primary' : 'outline-primary'} 
            onClick={() => setViewMode('flat')}
          >
            Sequence
          </Button>
        </ButtonGroup>
      </Card.Header>
      {viewMode === 'flat' ? renderFlatList() : renderGroupedList()}
    </Card>
  );
}