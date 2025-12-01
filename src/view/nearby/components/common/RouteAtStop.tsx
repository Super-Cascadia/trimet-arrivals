import { map, uniq } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { getArrivals } from "../../../../api/trimet/arrivals";
import { StopData, TrimetRoute } from "../../../../api/trimet/interfaces/types";

/**
 * Displays routes available at a transit stop.
 * 
 * @param props - Component props
 * @param props.stopData - Data about the stop including location and available routes
 * @returns A div containing a bus icon and badges for each route, or null if no routes are available
 */
export function RouteAtStop({ stopData }: { stopData: StopData }) {
  const [activeRoutes, setActiveRoutes] = useState<number[]>([]);

  useEffect(() => {
    async function fetchArrivals() {
      if (stopData?.location?.[0]?.locid) {
        try {
          const locid = stopData.location[0].locid;
          // Fetch arrivals for the rest of the day to determine active routes
          const now = moment();
          const endOfDay = moment().endOf('day');
          const minutesUntilEndOfDay = Math.max(1, endOfDay.diff(now, 'minutes'));
          
          const arrivals = await getArrivals(locid.toString(), minutesUntilEndOfDay);
          if (arrivals && arrivals.arrival) {
            const endOfDayTimestamp = endOfDay.valueOf();
            const activeArrivals = arrivals.arrival.filter(a => {
              const time = a.estimated || a.scheduled;
              return time <= endOfDayTimestamp;
            });
            const routes = uniq(activeArrivals.map(a => a.route));
            setActiveRoutes(routes);
          }
        } catch (e) {
          console.error("Failed to fetch arrivals for route status", e);
        }
      }
    }
    
    fetchArrivals();
  }, [stopData]);

  if (!stopData?.location || stopData.location.length === 0 || !stopData.location[0]?.route) {
    return null;
  }

  const routes: TrimetRoute[] = stopData.location[0].route;

  return (
    <div className="route-at-stop d-flex">
      <div className="flex-shrink-0" style={{ marginRight: "4px" }}>
        <FontAwesome name="bus" />
      </div>
      <div className="d-flex flex-wrap" style={{ gap: "2px" }}>
        {map(routes, (route: TrimetRoute) => {
          const isActive = activeRoutes.includes(route.route);
          return (
            <Badge
              key={route.route}
              bg={isActive ? "primary" : "secondary"}
              pill={true}
            >
              {route.route}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
