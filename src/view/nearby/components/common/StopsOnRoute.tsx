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
  allStopsOnRoute?: RouteDirectionStop[];
  downstreamArrivals?: any;
}

interface StopOnRouteParams {
  routeDirectionStop: RouteDirectionStop;
  selectedArrival?: any;
  currentStopSeq?: number;
  allStopsOnRoute?: RouteDirectionStop[];
  downstreamArrivals?: any;
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

function StopOnRoute({ routeDirectionStop, selectedArrival, currentStopSeq, allStopsOnRoute, downstreamArrivals }: StopOnRouteParams) {
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

export function StopsOnRoute({ remainingStopsOnRoute, selectedArrival, currentStopSeq, allStopsOnRoute, downstreamArrivals }: StopsOnRouteParams) {
  return (
    <Card>
      <Card.Header>Stops</Card.Header>
      <ListGroup className="list-group-flush">
        {map(
          remainingStopsOnRoute,
          (routeDirectionStop: RouteDirectionStop) => {
            return StopOnRoute({ routeDirectionStop, selectedArrival, currentStopSeq, allStopsOnRoute, downstreamArrivals });
          }
        )}
      </ListGroup>
    </Card>
  );
}
