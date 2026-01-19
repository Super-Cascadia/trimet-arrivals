import React, { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { RouteDirectionStop } from "../../../../../api/trimet/interfaces/routes";
import { ExpandCollapseListItem } from "../ui/ExpandCollapseListItem";
import { StopOnRoute } from "./StopOnRoute";
import { SelectAgainButton } from "../ui/SelectAgainButton";

interface RouteStopSelectorProps {
  /** Title for the card header */
  headerTitle: string;
  /** The currently selected stop */
  selectedStop: RouteDirectionStop | null;
  /** Array of all stops on the route */
  allStopsOnRoute: RouteDirectionStop[];
  /** Index of the currently selected stop in the allStopsOnRoute array */
  currentStopIndex: number;
  /** Callback function when a stop is selected */
  onStopSelect?: (stopId: number, stopIndex: number) => void;
  /** Optional additional content in the card header */
  headerActions?: React.ReactNode;
}

/**
 * Reusable component for displaying and selecting stops on a route.
 * Shows the current stop with ability to expand and view/select other stops.
 */
export function RouteStopSelector({
  headerTitle,
  selectedStop,
  allStopsOnRoute,
  currentStopIndex,
  onStopSelect,
  headerActions
}: RouteStopSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [showEarlier, setShowEarlier] = useState(false);
  const [showFuture, setShowFuture] = useState(false);

  const handleSelectStop = (stopId: number) => {
    if (onStopSelect) {
      const newIndex = allStopsOnRoute.findIndex(s => s.locid === stopId);
      onStopSelect(stopId, newIndex);
    }
    setIsSelecting(false);
    setShowEarlier(false);
    setShowFuture(false);
  };

  const handleSelectAgain = () => {
    setIsSelecting(true);
    setShowEarlier(false);
    setShowFuture(false);
  };

  const handleShowEarlier = () => {
    if (!isSelecting) return;
    setShowEarlier(!showEarlier);
    setShowFuture(false);
  };

  const handleShowFuture = () => {
    if (!isSelecting) return;
    setShowFuture(!showFuture);
    setShowEarlier(false);
  };

  const previousStops = currentStopIndex > 0
    ? allStopsOnRoute.slice(0, currentStopIndex)
    : [];
    
  const futureStops = currentStopIndex < allStopsOnRoute.length - 1
    ? allStopsOnRoute.slice(currentStopIndex + 1)
    : [];

  const hasEarlierStops = previousStops.length > 0;
  const hasFutureStops = futureStops.length > 0;
  const canSelectStops = onStopSelect && allStopsOnRoute.length > 0;
  const isActiveSelection = Boolean(isSelecting && canSelectStops);

  let stopsToShow: RouteDirectionStop[];
  if (!canSelectStops) {
    stopsToShow = selectedStop ? [selectedStop] : [];
  } else if (isActiveSelection && showEarlier) {
    stopsToShow = allStopsOnRoute.slice(0, currentStopIndex + 1);
  } else if (isActiveSelection && showFuture) {
    stopsToShow = allStopsOnRoute.slice(currentStopIndex);
  } else if (isActiveSelection) {
    const current = allStopsOnRoute[currentStopIndex] || selectedStop;
    const result: RouteDirectionStop[] = [];
    if (currentStopIndex > 0) {
      result.push(allStopsOnRoute[currentStopIndex - 1]);
    }
    if (current) {
      result.push(current);
    }
    if (currentStopIndex < allStopsOnRoute.length - 1) {
      result.push(allStopsOnRoute[currentStopIndex + 1]);
    }
    stopsToShow = result;
  } else {
    stopsToShow = selectedStop ? [selectedStop] : [];
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>{headerTitle}</span>
        <div className="d-flex align-items-center gap-2">
          {headerActions}
          {canSelectStops && !isActiveSelection && (hasEarlierStops || hasFutureStops) && (
            <SelectAgainButton onClick={handleSelectAgain} />
          )}
        </div>
      </Card.Header>
      
      <ListGroup className="list-group-flush">
        {isActiveSelection && hasEarlierStops && !showEarlier && (
          <ExpandCollapseListItem onClick={handleShowEarlier} icon="chevron-up">
            {previousStops.length} earlier stop{previousStops.length === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        
        {stopsToShow.map((stop: RouteDirectionStop) => {
          const isCurrentStop = stop.locid === allStopsOnRoute[currentStopIndex]?.locid;
          const canSelect = isActiveSelection;
          
          return (
            <StopOnRoute
              key={stop.locid}
              routeDirectionStop={stop}
              isSelected={isCurrentStop}
              onSelect={canSelect ? () => handleSelectStop(stop.locid) : undefined}
            />
          );
        })}
        
        {isActiveSelection && showEarlier && (
          <ExpandCollapseListItem onClick={handleShowEarlier} icon="chevron-up">
            show less
          </ExpandCollapseListItem>
        )}

        {isActiveSelection && hasFutureStops && !showFuture && (
          <ExpandCollapseListItem onClick={handleShowFuture} icon="chevron-down">
            {futureStops.length} future stop{futureStops.length === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}

        {isActiveSelection && showFuture && (
          <ExpandCollapseListItem onClick={handleShowFuture} icon="chevron-down">
            show less
          </ExpandCollapseListItem>
        )}
      </ListGroup>
    </Card>
  );
}
