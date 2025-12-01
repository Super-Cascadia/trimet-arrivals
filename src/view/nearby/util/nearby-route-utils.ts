import { filter, findIndex, last, slice, split, toNumber } from "lodash";
import { Arrival, ArrivalData, ArrivalLocation } from "../../../api/trimet/interfaces/arrivals";
import { RouteDataResultSet, RouteDirectionStop } from "../../../api/trimet/interfaces/routes";

/**
 * Filters arrivals by route ID.
 * @param arrivals - List of arrivals
 * @param routeId - Route ID to filter by
 * @returns Filtered list of arrivals
 */
export const filterArrivalsByRouteId = (arrivals: Arrival[], routeId: string): Arrival[] => {
  return filter(arrivals, (arrival: Arrival) => {
    return arrival.route === toNumber(routeId);
  });
};

/**
 * Gets a comma-separated string of downstream stop IDs.
 * @param routeStopsInDirection - List of stops on the route in a specific direction
 * @param currentStopId - The ID of the current stop
 * @param limit - Maximum number of stop IDs to return (default: 128)
 * @returns Comma-separated string of stop IDs
 */
export const getDownstreamStopIds = (
  routeStopsInDirection: RouteDirectionStop[],
  currentStopId: string,
  limit: number = 128
): string => {
  if (!routeStopsInDirection) {
    return "";
  }

  const stopIndex = findIndex(
    routeStopsInDirection,
    (routeDirectionStop: RouteDirectionStop) => {
      return routeDirectionStop.locid === toNumber(currentStopId);
    }
  );

  if (stopIndex >= 0) {
    const remainingStops = slice(routeStopsInDirection, stopIndex + 1);
    return remainingStops.slice(0, limit).map(s => s.locid).join(',');
  }

  return "";
};

/**
 * Extracts derived information about the route and stop.
 * @param arrivalData - Arrival data
 * @param filteredArrivalData - Filtered arrival data for the specific route
 * @param routeStopsData - Route stops data
 * @param stop - Current stop ID
 * @param selectedDepartureIndex - Index of the selected departure
 * @returns Object containing derived route and stop information
 */
export const getRouteStopInfo = (
  arrivalData: ArrivalData,
  filteredArrivalData: Arrival[],
  routeStopsData: RouteDataResultSet,
  stop: string,
  selectedDepartureIndex: number
) => {
  const stopLocation: ArrivalLocation = arrivalData?.location?.[0];
  const shortSign = filteredArrivalData?.[0] ? last(split(filteredArrivalData[0].shortSign, "To")) : null;
  const routeDesc = routeStopsData?.route?.[0]?.desc;
  const directionDesc = routeStopsData?.route?.[0]?.dir?.[0]?.desc;
  const routeStopsInDirection = routeStopsData?.route?.[0]?.dir?.[0]?.stop;
  
  const stopIndex = routeStopsInDirection ? findIndex(
    routeStopsInDirection,
    (routeDirectionStop: RouteDirectionStop) => {
      return routeDirectionStop.locid === toNumber(stop);
    }
  ) : -1;

  const remainingStopsOnRoute = routeStopsInDirection && stopIndex >= 0 ? slice(routeStopsInDirection, stopIndex + 1) : [];

  const selectedArrival = filteredArrivalData && filteredArrivalData.length > selectedDepartureIndex ? filteredArrivalData[selectedDepartureIndex] : null;
  const currentStop = stopIndex >= 0 && routeStopsInDirection ? routeStopsInDirection[stopIndex] : null;
  const currentStopSeq = currentStop ? currentStop.seq : undefined;

  return {
    stopLocation,
    shortSign,
    routeDesc,
    directionDesc,
    routeStopsInDirection,
    stopIndex,
    remainingStopsOnRoute,
    selectedArrival,
    currentStop,
    currentStopSeq
  };
};
