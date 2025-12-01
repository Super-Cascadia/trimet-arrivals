import { useState } from "react";
import { Dictionary } from "lodash";
import { StopData, TrimetRoute, Location } from "../../../../api/trimet/interfaces/types";
import { getNearbyStops } from "../../../../api/trimet/stops";
import { processRoutes } from "../../util/dataUtils";

const DEFAULT_RADIUS = 1000;

/**
 * Hook to manage map data (stops, routes) and radius.
 * 
 * @returns Data state and fetchers
 */
export function useMapData() {
  const [radiusSize, setRadiusSize] = useState<number>(DEFAULT_RADIUS);
  const [nearbyStops, setNearbyStopData] = useState<StopData>(undefined);
  const [nearbyRoutes, setNearbyRoutesData] = useState<Dictionary<TrimetRoute[]>>(undefined);

  function fetchInitialData(location: Location) {
    return getNearbyStops(location, radiusSize).then((stopData: StopData) => {
      const routes = processRoutes(stopData);
      setNearbyStopData(stopData);
      setNearbyRoutesData(routes);
    });
  }

  return {
    radiusSize,
    setRadiusSize,
    nearbyStops,
    setNearbyStopData,
    nearbyRoutes,
    setNearbyRoutesData,
    fetchInitialData
  };
}
