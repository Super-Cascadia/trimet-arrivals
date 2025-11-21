import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { Badge, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { RouteDirectionStop } from "../../../../api/trimet/interfaces/routes";
import { StopData, TrimetRoute } from "../../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../../api/trimet/stops";
import "./StopsOnRoute.scss";

interface StopsOnRouteParams {
  remainingStopsOnRoute: RouteDirectionStop[];
  selectedArrival?: any;
  currentStopSeq?: number;
}

interface StopOnRouteParams {
  routeDirectionStop: RouteDirectionStop;
  selectedArrival?: any;
  currentStopSeq?: number;
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

function StopOnRoute({ routeDirectionStop, selectedArrival, currentStopSeq }: StopOnRouteParams) {
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

  // Calculate estimated arrival time based on selected bus's arrival at current stop
  const getEstimatedArrivalTime = () => {
    if (!selectedArrival || !selectedArrival.estimated || currentStopSeq === undefined) {
      return null;
    }

    const targetStopSeq = routeDirectionStop.seq;
    
    // Calculate stops away from the current stop (where bus will arrive)
    const stopsAway = targetStopSeq - currentStopSeq;
    
    // Don't show negative or zero (should already be filtered but double check)
    if (stopsAway <= 0) {
      return null;
    }
    
    // Calculate estimated time based on arrival time at current stop
    // Assume average of 1.5 minutes per stop
    const avgMinutesPerStop = 1.5;
    const additionalMinutes = stopsAway * avgMinutesPerStop * 60 * 1000; // convert to ms
    
    const estimatedArrival = selectedArrival.estimated + additionalMinutes;
    
    return new Date(estimatedArrival).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const estimatedTime = getEstimatedArrivalTime();

  return (
    <ListGroupItem key={routeDirectionStop.locid} className="d-flex justify-content-between align-items-center">
      <div>
        <span>{routeDirectionStop.desc}</span>
        <small className="text-muted"> ({routeDirectionStop.locid})</small>
        {stopData && <RouteAtStop stopData={stopData} />}
      </div>
      {estimatedTime && (
        <small className="text-muted stop-arrival-time">
          {estimatedTime}
        </small>
      )}
    </ListGroupItem>
  );
}

export function StopsOnRoute({ remainingStopsOnRoute, selectedArrival, currentStopSeq }: StopsOnRouteParams) {
  return (
    <Card>
      <Card.Header>Stops</Card.Header>
      <ListGroup className="list-group-flush">
        {map(
          remainingStopsOnRoute,
          (routeDirectionStop: RouteDirectionStop) => {
            return StopOnRoute({ routeDirectionStop, selectedArrival, currentStopSeq });
          }
        )}
      </ListGroup>
    </Card>
  );
}
