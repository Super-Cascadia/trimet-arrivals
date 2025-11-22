import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import { StopData, TrimetRoute } from "../../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../../api/trimet/stops";
import "./StopsOnRoute.scss";

interface StopsOnRouteParams {
  remainingStopsOnRoute: RouteDirectionStop[];
  selectedArrival?: any;
  currentStopSeq?: number;
  allStopsOnRoute?: RouteDirectionStop[];
  downstreamArrivals?: any;
  onDestinationSelect?: (index: number | null) => void;
}

interface StopOnRouteParams {
  routeDirectionStop: RouteDirectionStop;
  selectedArrival?: any;
  currentStopSeq?: number;
  allStopsOnRoute?: RouteDirectionStop[];
  downstreamArrivals?: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

function RouteAtStop({ stopData }: { stopData: StopData }) {
  if (!stopData?.location || stopData.location.length === 0 || !stopData.location[0]?.route) {
    return null;
  }

  const routes: TrimetRoute[] = stopData.location[0].route;

  return (
    <div className="route-at-stop">
      <FontAwesome name="bus" />
      {map(routes, (route: TrimetRoute) => {
        return (
          <Badge key={route.route} bg="light" text="dark" pill={true}>
            {route.route}
          </Badge>
        );
      })}
    </div>
  );
}

function StopOnRoute({ routeDirectionStop, selectedArrival, currentStopSeq, allStopsOnRoute, downstreamArrivals, isSelected, onSelect }: StopOnRouteParams) {
  const [stopData, setStopData] = useState<StopData>(null);

  useEffect(() => {
    async function fetchData() {
      if (routeDirectionStop) {
        const location = {
          coords: {
            latitude: routeDirectionStop.lat,
            longitude: routeDirectionStop.lng
          }
        };

        const nearbyStopData = await getNearbyStops(location, 10);
        setStopData(nearbyStopData);
      }
    }

    fetchData();
  }, [routeDirectionStop]);

  // Get actual estimated arrival time from API data
  const getEstimatedArrivalTime = () => {
    if (!selectedArrival || !downstreamArrivals) {
      return null;
    }

    // Find the arrival at this stop for the selected vehicle
    const arrivalAtThisStop = downstreamArrivals.arrival?.find(
      (arrival: any) => 
        arrival.locid === routeDirectionStop.locid && 
        arrival.vehicleID === selectedArrival.vehicleID &&
        arrival.route === selectedArrival.route &&
        arrival.dir === selectedArrival.dir
    );
    
    if (arrivalAtThisStop?.estimated) {
      return new Date(arrivalAtThisStop.estimated).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // Fallback to scheduled time if no estimate
    if (arrivalAtThisStop?.scheduled) {
      return new Date(arrivalAtThisStop.scheduled).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return null;
  };

  const estimatedTime = getEstimatedArrivalTime();

  return (
    <ListGroupItem 
      key={routeDirectionStop.locid} 
      className="d-flex justify-content-between align-items-center"
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
      onClick={onSelect}
    >
      <div className="d-flex align-items-center gap-2 flex-grow-1">
        <Form.Check
          type="radio"
          checked={isSelected}
          onChange={() => {}}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect();
          }}
          disabled={!onSelect}
        />
        <div>
          <span>{routeDirectionStop.desc}</span>
          <small className="text-muted"> ({routeDirectionStop.locid})</small>
          {stopData && <RouteAtStop stopData={stopData} />}
        </div>
      </div>
      {estimatedTime && (
        <small className="text-muted stop-arrival-time">
          {estimatedTime}
        </small>
      )}
    </ListGroupItem>
  );
}

export function StopsOnRoute({ remainingStopsOnRoute, selectedArrival, currentStopSeq, allStopsOnRoute, downstreamArrivals, onDestinationSelect }: StopsOnRouteParams) {
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(true);
  const [showEarlier, setShowEarlier] = useState(false);
  const [showFuture, setShowFuture] = useState(false);

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
        <span>Stops</span>
        {!isSelecting && selectedDestinationIndex !== null && (
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={handleSelectAgain}
          >
            <FontAwesome name="repeat" className="me-1" />
            Select Again
          </Button>
        )}
      </Card.Header>
      <ListGroup className="list-group-flush">
        {hasEarlierStops && !showEarlier && (
          <ListGroup.Item
            as="li"
            className="d-flex justify-content-center align-items-center"
            onClick={handleShowEarlier}
            style={{ cursor: 'pointer', color: '#007bff' }}
          >
            <FontAwesome name="chevron-up" className="me-2" />
            <span>{selectedDestinationIndex} earlier stop{selectedDestinationIndex === 1 ? '' : 's'}</span>
          </ListGroup.Item>
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
          <ListGroup.Item
            as="li"
            className="d-flex justify-content-center align-items-center"
            onClick={handleShowEarlier}
            style={{ cursor: 'pointer', color: '#007bff' }}
          >
            <FontAwesome name="chevron-up" className="me-2" />
            <span>show less</span>
          </ListGroup.Item>
        )}
        {hasFutureStops && !showFuture && (
          <ListGroup.Item
            as="li"
            className="d-flex justify-content-center align-items-center"
            onClick={handleShowFuture}
            style={{ cursor: 'pointer', color: '#007bff' }}
          >
            <FontAwesome name="chevron-down" className="me-2" />
            <span>{remainingStopsOnRoute.length - selectedDestinationIndex - 1} future stop{remainingStopsOnRoute.length - selectedDestinationIndex - 1 === 1 ? '' : 's'}</span>
          </ListGroup.Item>
        )}
        {showFuture && (
          <ListGroup.Item
            as="li"
            className="d-flex justify-content-center align-items-center"
            onClick={handleShowFuture}
            style={{ cursor: 'pointer', color: '#007bff' }}
          >
            <FontAwesome name="chevron-down" className="me-2" />
            <span>show less</span>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
}
