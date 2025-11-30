import { map } from "lodash";
import React from "react";
import { Badge } from "react-bootstrap";
import FontAwesome from "react-fontawesome";
import { StopData, TrimetRoute } from "../../../../api/trimet/interfaces/types";

/**
 * Displays routes available at a transit stop.
 * 
 * @param props - Component props
 * @param props.stopData - Data about the stop including location and available routes
 * @returns A div containing a bus icon and badges for each route, or null if no routes are available
 */
export function RouteAtStop({ stopData }: { stopData: StopData }) {
  if (!stopData?.location || stopData.location.length === 0 || !stopData.location[0]?.route) {
    return null;
  }

  const routes: TrimetRoute[] = stopData.location[0].route;

  return (
    <div className="route-at-stop">
      <FontAwesome name="bus" style={{ marginRight: "4px" }} />
      {map(routes, (route: TrimetRoute, index: number) => {
        return (
          <Badge
            key={route.route}
            bg="secondary"
            pill={true}
            style={{ marginRight: index === routes.length - 1 ? 0 : "2px" }}
          >
            {route.route}
          </Badge>
        );
      })}
    </div>
  );
}
