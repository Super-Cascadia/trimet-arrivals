import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import { ExpandCollapseListItem } from "./ExpandCollapseListItem";
import { StopOnRoute } from "./StopOnRoute";
import { SelectAgainButton } from "./SelectAgainButton";
import "./StopsOnRoute.scss";

interface StopsOnRouteParams {
  remainingStopsOnRoute: RouteDirectionStop[];
  selectedArrival?: any;
  currentStopSeq?: number;
  allStopsOnRoute?: RouteDirectionStop[];
  downstreamArrivals?: any;
  onDestinationSelect?: (index: number | null) => void;
  selectedDestinationIndex?: number | null;
}

/**
 * StopsOnRoute component displays a list of stops along a route with destination selection functionality.
 * Users can select a destination stop, view earlier/future stops, and manage their selection.
 * 
 * @param {StopsOnRouteParams} props - The component props
 * @param {RouteDirectionStop[]} props.remainingStopsOnRoute - Array of remaining stops on the route from current position
 * @param {any} [props.selectedArrival] - Currently selected arrival information
 * @param {number} [props.currentStopSeq] - Sequence number of the current stop
 * @param {RouteDirectionStop[]} [props.allStopsOnRoute] - Complete array of all stops on the route
 * @param {any} [props.downstreamArrivals] - Arrival information for downstream stops
 * @param {(index: number | null) => void} [props.onDestinationSelect] - Callback function when a destination is selected or deselected
 * @param {number | null} [props.selectedDestinationIndex] - Index of the initially selected destination stop
 * @returns {JSX.Element} A card component with destination selection interface
 */
export function StopsOnRoute({ remainingStopsOnRoute, selectedArrival, currentStopSeq, allStopsOnRoute, downstreamArrivals, onDestinationSelect, selectedDestinationIndex: initialSelectedDestinationIndex }: StopsOnRouteParams) {
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const [showEarlier, setShowEarlier] = useState(false);
  const [showFuture, setShowFuture] = useState(false);

  // Sync internal state with prop when it changes (e.g., from URL parameter)
  useEffect(() => {
    if (initialSelectedDestinationIndex !== undefined && initialSelectedDestinationIndex !== null) {
      setSelectedDestinationIndex(initialSelectedDestinationIndex);
      setIsSelecting(false);
    }
  }, [initialSelectedDestinationIndex]);

  const handleSelectDestination = (index: number) => {
    setSelectedDestinationIndex(index);
    setIsSelecting(false);
    setShowEarlier(false);
    setShowFuture(false);
    if (onDestinationSelect) {
      onDestinationSelect(index);
    }
  };

  const handleSelectAgain = () => {
    setIsSelecting(true);
    setShowEarlier(false);
    setShowFuture(false);
    if (onDestinationSelect) {
      onDestinationSelect(null);
    }
  };

  const handleShowEarlier = () => {
    setShowEarlier(!showEarlier);
    setShowFuture(false);
  };

  const handleShowFuture = () => {
    setShowFuture(!showFuture);
    setShowEarlier(false);
  };

  let stopsToShow: RouteDirectionStop[];
  if (isSelecting) {
    stopsToShow = remainingStopsOnRoute;
  } else if (selectedDestinationIndex !== null) {
    if (showEarlier) {
      // Show from start to selected (inclusive)
      stopsToShow = remainingStopsOnRoute.slice(0, selectedDestinationIndex + 1);
    } else if (showFuture) {
      // Show from selected to end (inclusive)
      stopsToShow = remainingStopsOnRoute.slice(selectedDestinationIndex);
    } else {
      // Show only selected
      stopsToShow = [remainingStopsOnRoute[selectedDestinationIndex]];
    }
  } else {
    stopsToShow = remainingStopsOnRoute;
  }
  
  const hasMoreStops = remainingStopsOnRoute.length > 1;
  const hasEarlierStops = selectedDestinationIndex !== null && selectedDestinationIndex > 0 && !isSelecting;
  const hasFutureStops = selectedDestinationIndex !== null && selectedDestinationIndex < remainingStopsOnRoute.length - 1 && !isSelecting;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Destination</span>
        {!isSelecting && selectedDestinationIndex !== null && (
          <SelectAgainButton onClick={handleSelectAgain} />
        )}
      </Card.Header>
      <ListGroup className="list-group-flush">
        {hasEarlierStops && !showEarlier && (
          <ExpandCollapseListItem onClick={handleShowEarlier} icon="chevron-up">
            {selectedDestinationIndex} earlier stop{selectedDestinationIndex === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        {map(
          stopsToShow,
          (routeDirectionStop: RouteDirectionStop, index: number) => {
            const actualIndex = remainingStopsOnRoute.indexOf(routeDirectionStop);
            const canSelect = isSelecting || showEarlier || showFuture;
            
            return (
              <StopOnRoute
                key={routeDirectionStop.locid}
                routeDirectionStop={routeDirectionStop}
                selectedArrival={selectedArrival}
                currentStopSeq={currentStopSeq}
                allStopsOnRoute={allStopsOnRoute}
                downstreamArrivals={downstreamArrivals}
                isSelected={actualIndex === selectedDestinationIndex}
                onSelect={canSelect ? () => handleSelectDestination(actualIndex) : undefined}
              />
            );
          }
        )}
        {showEarlier && (
          <ExpandCollapseListItem onClick={handleShowEarlier} icon="chevron-up">
            show less
          </ExpandCollapseListItem>
        )}
        {hasFutureStops && !showFuture && (
          <ExpandCollapseListItem onClick={handleShowFuture} icon="chevron-down">
            {remainingStopsOnRoute.length - selectedDestinationIndex - 1} future stop{remainingStopsOnRoute.length - selectedDestinationIndex - 1 === 1 ? '' : 's'}
          </ExpandCollapseListItem>
        )}
        {showFuture && (
          <ExpandCollapseListItem onClick={handleShowFuture} icon="chevron-down">
            show less
          </ExpandCollapseListItem>
        )}
      </ListGroup>
    </Card>
  );
}