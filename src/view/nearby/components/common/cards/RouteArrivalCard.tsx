import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getArrivals } from "../../../../../api/trimet/arrivals";
import { Arrival } from "../../../../../api/trimet/interfaces/arrivals";
import { TrimetRoute } from "../../../../../api/trimet/interfaces/types";
import { ArrivalTimestamp } from "../arrivals/ArrivalTimestamp";

/**
 * Props for the RouteArrivalCard component.
 */
interface RouteArrivalCardProps {
  /** The TriMet route information */
  route: TrimetRoute;
  /** The direction object containing direction ID and description */
  direction: any;
  /** The stop ID to fetch arrivals for */
  stopId: number;
}

/**
 * A card component that displays arrival information for a specific route and direction at a stop.
 * 
 * This component fetches and displays up to 4 upcoming arrivals, refreshing automatically every 30 seconds.
 * Clicking the card navigates to a detailed view of the route.
 * 
 * @param props - The component props
 * @returns A ListGroup.Item containing route information and arrival times
 */
export function RouteArrivalCard({ route, direction, stopId }: RouteArrivalCardProps) {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArrivals() {
      try {
        const arrivalData = await getArrivals(stopId.toString(), 45);
        // Filter arrivals for this specific route and direction
        const filtered = arrivalData.arrival.filter(
          (a: Arrival) => a.route === route.route && a.dir === direction.dir
        );
        setArrivals(filtered.slice(0, 4)); // Get up to 4 arrivals
        setLoading(false);
      } catch (error) {
        console.error('Error fetching arrivals:', error);
        setLoading(false);
      }
    }

    fetchArrivals();
    const interval = setInterval(fetchArrivals, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [route.route, direction.dir, stopId]);

  if (loading) {
    return (
      <ListGroup.Item variant="light" className="d-flex justify-content-between align-items-start list-item-compact">
        <div className="me-1">
          <span className="fw-bold h2">
            {route.route}
            <span className="h6 route-direction-desc">{direction.desc}</span>
          </span>
        </div>
        <div className="text-end arrival-time-container flex-shrink-0">
          <span className="text-muted">Loading...</span>
        </div>
      </ListGroup.Item>
    );
  }

  if (arrivals.length === 0) {
    return (
      <ListGroup.Item variant="light" className="d-flex justify-content-between align-items-start list-item-compact">
        <div className="me-1">
          <span className="fw-bold h2">
            {route.route}
            <span className="h6 route-direction-desc">{direction.desc}</span>
          </span>
        </div>
        <div className="text-end arrival-time-container flex-shrink-0">
          <span className="text-muted">No arrivals</span>
        </div>
      </ListGroup.Item>
    );
  }

  const [firstArrival, ...additionalArrivals] = arrivals;

  const handleCardClick = () => {
    const url = `/nearby/simple-routes/${route.route}?stop=${stopId}&direction=${direction.dir}`;
    navigate(url);
  };

  return (
    <ListGroup.Item 
      variant="light" 
      className="d-flex justify-content-between align-items-start list-item-compact"
      action
      onClick={handleCardClick}
    >
      <div className="me-1">
        <span className="fw-bold h2 route-number">
          {route.route}
          <span className="h6 route-direction-desc">{direction.desc}</span>
        </span>
      </div>
      <div className="text-end arrival-time-container flex-shrink-0">
        <ul className="list-unstyled mb-0">
          <li className="fw-bold">
            <ArrivalTimestamp 
              estimatedArrivalTime={firstArrival.estimated} 
              scheduledArrivalTime={firstArrival.scheduled} 
            />
          </li>
          {additionalArrivals.map((arrival, idx) => (
            <li key={idx} className="text-muted">
              <ArrivalTimestamp 
                estimatedArrivalTime={arrival.estimated} 
                scheduledArrivalTime={arrival.scheduled} 
              />
            </li>
          ))}
        </ul>
      </div>
    </ListGroup.Item>
  );
}
